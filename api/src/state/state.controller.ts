import { Controller, Get, Put, Body, Param, UseGuards, Patch, Request, NotFoundException, InternalServerErrorException, Logger } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import * as jwt from 'jsonwebtoken';
import { StateService } from './state.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { State } from './entities/state.entity';
import { UpdateStateDto } from './dto/update-state.dto';

@Controller('state')
export class StateController {
  private readonly logger = new Logger(StateController.name);

  constructor(private readonly stateService: StateService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findByUserme(@Request() req: Request) {
    const token = req.headers['authorization'].split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string };
    this.logger.log(`Kullanıcı kendi state bilgisini görüntülüyor. Kullanıcı ID: ${decoded.id}`);
    return this.stateService.findByUserId(+decoded.id);
  }

  @Get(':userId')
  findByUserId(@Param('userId') userId: string) {
    this.logger.log(`${userId} ID'li kullanıcının state bilgisi istendi`);
    return this.stateService.findByUserId(+userId);
  }


  @Patch(':userId')
  async updateState(
    @Param('userId') userId: string,
    @Body() updateStateDto: UpdateStateDto
  ) {
    this.logger.log(`${userId} ID'li kullanıcının state bilgisi güncelleniyor`);
    try {
      return await this.stateService.update(+userId, updateStateDto);
    } catch (error) {
      this.logger.error(`State güncellenirken hata: ${error.message}`);
      if (error instanceof NotFoundException) {
        throw new NotFoundException('State bulunamadı');
      }
      throw new InternalServerErrorException('State güncellenirken bir hata oluştu');
    }
  }
}

