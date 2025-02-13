import { ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import { IsString, IsEmail, IsBoolean, IsDateString, IsMobilePhone, Length, IsOptional } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'Kullanıcı adı', example: 'Ahmet' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Kullanıcı soyadı', example: 'Yılmaz' })
  @IsString()
  surname: string;

  @ApiProperty({ description: 'Kullanıcı takma adı', example: 'ahmet123' })
  @IsString()
  nickname: string;

  @ApiProperty({ description: 'E-posta adresi', example: 'ahmet@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Şifre' })
  @IsString()
  @Length(6, 20)
  password: string;

  @ApiProperty({ description: 'Telefon numarası', example: '+905551234567' })
  @IsMobilePhone('tr-TR')
  tel: string;

  @ApiProperty({ description: 'TC Kimlik No', example: '12345678901' })
  @IsString()
  @Length(11, 11)
  tc: string;

  @ApiProperty({ description: 'Doğum tarihi', example: '1990-01-01' })
  @IsDateString()
  birthDate: string;

  @ApiProperty({ description: 'Şehir', example: 'İstanbul' })
  @IsString()
  city: string;

  @ApiProperty({ description: 'KVKK onayı', example: true })
  @IsBoolean()
  kvkk: boolean;

  @ApiPropertyOptional({ description: 'Sosyal medya hesabı', example: '@ahmet123' })
  @IsString()
  @IsOptional()
  socialMedia?: string;

  // role
  @ApiProperty({ description: 'Kullanıcı rolü', example: 'user', default: 'user' })
  @IsString()
  @IsOptional()
  role: string = 'user';

  @ApiPropertyOptional({ description: 'Youtube kanalı', example: '@ahmet_youtube' })
  @IsString()
  @IsOptional()
  youtube?: string;
}
