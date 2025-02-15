import { Controller, Post, Body, Get, Param, Logger, UseGuards, Request } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePaymentDto } from './dto/create-payment.dto';
import * as jwt from 'jsonwebtoken';

@ApiTags('Payment')
@ApiBearerAuth()
@Controller('payment')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createPayment(
    @Request() req,
    @Body() createPaymentDto: CreatePaymentDto
  ) {
    const token = req.headers['authorization'].split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string, email: string };
    
    return this.paymentService.createPayment(createPaymentDto, decoded);
  }

  @Post('callback')
  async handleCallback(@Body() callbackData: any) {
    this.logger.log(`Payment callback received for merchant_oid: ${callbackData.merchant_oid}`);
    return this.paymentService.handleCallback(callbackData);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':merchantOid')
  async getPayment(
    @Request() req,
    @Param('merchantOid') merchantOid: string
  ) {
    const token = req.headers['authorization'].split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string, email: string };
    
    this.logger.log(`Fetching payment details for merchant_oid: ${merchantOid}`);
    return this.paymentService.getPayment(merchantOid, decoded);
  }
} 