import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from './entities/payment.entity';
import * as crypto from 'crypto';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private readonly merchantId: string;
  private readonly merchantKey: string;
  private readonly merchantSalt: string;

  constructor(
    private configService: ConfigService,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
  ) {
    this.merchantId = this.configService.get<string>('PAYTR_MERCHANT_ID');
    this.merchantKey = this.configService.get<string>('PAYTR_MERCHANT_KEY');
    this.merchantSalt = this.configService.get<string>('PAYTR_MERCHANT_SALT');
  }

  async createPayment(createPaymentDto: CreatePaymentDto, user: any) {
    const merchantOid = Date.now().toString(); // microtime yerine Date.now() kullanıyoruz
    
    const hashStr = `${this.merchantId}${createPaymentDto.userIp}${merchantOid}${user.email}${createPaymentDto.amount}${createPaymentDto.paymentType}${createPaymentDto.installmentCount || '0'}${createPaymentDto.currency}${createPaymentDto.testMode || '0'}${createPaymentDto.non3d || '0'}`;
    
    const paytrToken = hashStr + this.merchantSalt;
    const token = crypto
      .createHmac('sha256', this.merchantKey)
      .update(paytrToken)
      .digest('base64');

    const payment = this.paymentRepository.create({
      merchantOid,
      email: user.email,
      amount: createPaymentDto.amount,
      currency: createPaymentDto.currency,
      status: PaymentStatus.PENDING,
      basketItems: createPaymentDto.basketItems
    });

    await this.paymentRepository.save(payment);

    return {
      token,
      merchantOid,
      paymentData: {
        ...createPaymentDto,
        email: user.email,
        merchantOid,
      }
    };
  }

  async handleCallback(callbackData: any) {
    const { merchant_oid, status, total_amount, hash } = callbackData;

    // Hash doğrulama
    const paytrToken = merchant_oid + this.merchantSalt + status + total_amount;
    const calculatedHash = crypto
      .createHmac('sha256', this.merchantKey)
      .update(paytrToken)
      .digest('base64');

    if (calculatedHash !== hash) {
      this.logger.error('Invalid hash in callback');
      throw new Error('Invalid hash');
    }

    const payment = await this.paymentRepository.findOne({ 
      where: { merchantOid: merchant_oid } 
    });
    
    //kurumsal@paytr.com
    
    if (!payment) {
      this.logger.error(`Payment not found: ${merchant_oid}`);
      throw new Error('Payment not found');
    }

    payment.status = status === 'success' ? PaymentStatus.SUCCESS : PaymentStatus.FAILED;
    if (status !== 'success') {
      payment.errorMessage = callbackData.failed_reason_msg || 'Payment failed';
    }

    await this.paymentRepository.save(payment);
    return 'OK';
  }

  async getPayment(merchantOid: string, user: any) {
    const payment = await this.paymentRepository.findOne({ 
      where: { merchantOid } 
    });

    if (!payment) {
      throw new Error('Payment not found');
    }

    // Kullanıcının kendi ödemesini görüntüleyebilmesi için kontrol
    if (payment.email !== user.email) {
      throw new UnauthorizedException('You are not authorized to view this payment');
    }

    return payment;
  }
}
