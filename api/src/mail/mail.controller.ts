import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get('test')
  async testMail() {
    const result = await this.mailService.sendEmail(
      'yildirimsamet051@gmail.com',
      'Bu bir test emailidir.\n\nFlow360 Mail Sistemi Test Mesajı'
    );

    return {
      success: result,
      message: result ? 'Email başarıyla gönderildi' : 'Email gönderilemedi',
    };
  }
} 