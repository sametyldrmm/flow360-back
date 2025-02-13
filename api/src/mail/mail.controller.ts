import { Controller, Get, Logger } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  private readonly logger = new Logger(MailController.name);

  constructor(private readonly mailService: MailService) {}

  @Get('test')
  async testMail() {
    this.logger.log('Test mail gönderme isteği alındı');
    const result = await this.mailService.sendEmail(
      'yildirimsamet051@gmail.com',
      'Bu bir test emailidir.\n\nFlow360 Mail Sistemi Test Mesajı'
    );

    if (result) {
      this.logger.log('Test mail başarıyla gönderildi');
    } else {
      this.logger.error('Test mail gönderilemedi');
    }

    return {
      success: result,
      message: result ? 'Email başarıyla gönderildi' : 'Email gönderilemedi',
    };
  }

  @Get('refresh-token')
  async refreshToken() {
    this.logger.log('Token yenileme isteği alındı');
    try {
      const tokenInfo = await this.mailService.refreshAccessToken();
      this.logger.log('Token başarıyla yenilendi');
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
      this.logger.error(`Token yenileme hatası: ${error.message}`);
      return {
        success: false,
        message: 'Token yenileme hatası',
        error: error.message
      };
    }
  }
} 