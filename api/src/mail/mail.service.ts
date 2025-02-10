import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class MailService {
  constructor() {}

  private async getGmailClient() {
    const oauth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
      scope: 'https://www.googleapis.com/auth/gmail.send'
    });

    return google.gmail({ version: 'v1', auth: oauth2Client });
  }

  /**
   * Belirtilen adrese email gönderir.
   * @param toEmail Alıcının email adresi
   * @param message Gönderilecek mesaj içeriği
   * @returns Email gönderimi başarılı ise true, aksi halde false
   */
  async sendEmail(toEmail: string, message: string): Promise<boolean> {
    try {
      const gmail = await this.getGmailClient();

      const emailLines = [
        `From: ${process.env.SENDER_EMAIL}`,
        `To: ${toEmail}`,
        'Subject: Flow360 Notification',
        '',
        message,
      ];
      const emailContent = emailLines.join('\n');

      const encodedMessage = Buffer.from(emailContent)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedMessage,
        },
      });

      return true;
    } catch (error) {
      console.error('Email gönderme hatası:', error);
      return false;
    }
  }

  async sendPasswordResetCode(email: string, code: string) {
    const message = `
      Şifre Sıfırlama Kodunuz: ${code}
      
      Bu kod 5 dakika süreyle geçerlidir.
    `;
    
    return this.sendEmail(email, message);
  }

  async refreshAccessToken() {
    try {
      console.log(process.env.GOOGLE_CLIENT_ID);
      console.log(process.env.GOOGLE_CLIENT_SECRET);
      console.log(process.env.GOOGLE_REDIRECT_URI);

      const oauth2Client = new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
      );

      oauth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
        scope: 'https://www.googleapis.com/auth/gmail.send'
      });

      const response = await oauth2Client.getAccessToken();
      const accessToken = response.res?.data?.access_token || response.token;
      const expiryDate = response.res?.data?.expiry_date;
      
      console.log('Yeni Access Token:', accessToken);
      console.log('Tüm Response:', response);
      
      // .env için gerekli bilgileri formatlı göster
      console.log('\n.env için güncel değerler:');
      console.log('GOOGLE_ACCESS_TOKEN=', accessToken);
      console.log('GOOGLE_REFRESH_TOKEN=', process.env.GOOGLE_REFRESH_TOKEN);
      console.log('GOOGLE_TOKEN_TYPE=Bearer');
      console.log('GOOGLE_TOKEN_EXPIRY=', expiryDate);
      
      // Expiry date'i okunabilir formatta göster
      if (expiryDate) {
        const expiryDateFormatted = new Date(expiryDate).toLocaleString('tr-TR');
        console.log('\nToken Geçerlilik Süresi:', expiryDateFormatted);
      }

      return {
        accessToken,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        tokenType: 'Bearer',
        expiryDate,
        expiryDateFormatted: expiryDate ? new Date(expiryDate).toLocaleString('tr-TR') : null
      };
    } catch (error) {
      console.error('Access token yenileme hatası:', error.message);
      if (error.response) {
        console.error('Hata detayları:', error.response.data);
      }
      throw error;
    }
  }
}
