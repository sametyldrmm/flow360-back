import { IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty()
  @IsNumber()
  amount: number; // 499

  @ApiProperty()
  @IsString()
  currency: string; // TRY

  @ApiProperty()
  @IsString()
  paymentType: string; // 3D_PAY olmayadabilir

  @ApiProperty()
  @IsString()
  @IsOptional()
  installmentCount?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  testMode?: string; // 0

  @ApiProperty()
  @IsString()
  @IsOptional() 
  non3d?: string; // 0

  @ApiProperty()
  @IsString()
  basketItems: string; // [{"id":"1","name":"test","price":"499","quantity":"1"}]

  @ApiProperty()
  @IsString()
  userIp: string; // 127.0.0.1
} 