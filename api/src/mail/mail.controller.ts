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

  @Get('refresh-token')
  async refreshToken() {
    try {
      const tokenInfo = await this.mailService.refreshAccessToken();
      
      return {
        success: true,
        data: {
          accessToken: tokenInfo.accessToken,
          refreshToken: tokenInfo.refreshToken,
          tokenType: tokenInfo.tokenType,
          expiryDate: tokenInfo.expiryDate,
          expiryDateFormatted: tokenInfo.expiryDateFormatted
        },
        message: 'Token başarıyla yenilendi'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Token yenileme hatası',
        error: error.message
      };
    }
  }
} 