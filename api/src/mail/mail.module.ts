import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { ConfigModule } from '@nestjs/config';
import { MailController } from './mail.controller';

@Module({
  imports: [ConfigModule],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {} 
/*
  Kaç farklı mail olucak.
    Doğrulama 6 haneli şifre oluşturulacak. Şifreimi unuttum.
    Seçildin kanka. / Seçilmedin kanka.

  - Mail gönderilcek.   - Şifremi unuttum.
  - Login
  - JWT ortak
  - SSL 
  - Kayıt.
  - Başvuru formu.
  - Ödeme entagrasyonu
  - File Transfer Protokol. AWS Olmadan yapılmıyor.
  - Durumlar(ödeme, başvuru, seçilme)

  Admin Paneli
  
  - Red etme / Kabul etme / Favorilere ekleme
  - 

  Kullanıcı Aşamaları - 
    Durumların hepsini



  */