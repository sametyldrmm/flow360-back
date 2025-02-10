import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(private configService: ConfigService) {}
  
  /**
   * Gmail API istemcisini oluşturur.
   */
  private async getGmailClient() {
    const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];
    const tokens = {
      access_token: 'ya29.a0AXeO80Sq0NxQ-Vw-dJ24O8SKM-PnmHtnYxW_MmvPVP_4tREQ5pzBNlRFSX3TgrDHeU8kftRMpXd9241T1_5vp5bZZQxTRozJWpeFhEFxJvp-Dk94JbTwMSuuiVWM6DD64PfIXA_7TnYfm-zpwIx4ZfrQTMf1J-Iw6Olu6AAqaCgYKAa4SARESFQHGX2Mi8TAUWYtDJ4oPqUDo58vBkQ0175',
      refresh_token: '1//09B77iEf6ZB6XCgYIARAAGAkSNwF-L9IrT1qCdZqk_Lk1fwVkvWRb25o9MRnKYTereIAkcZvJMpYVsOXh4QqS5oLMb-AkBszYISc',
      scope: 'https://www.googleapis.com/auth/gmail.send',
      token_type: 'Bearer',
      expiry_date: 1739123300203
    };
  
    const clientSecretPath = path.join(
      process.cwd(),
      this.configService.get<string>('GOOGLE_CLIENT_SECRET_PATH'),
    );

    const credentials = JSON.parse(fs.readFileSync(clientSecretPath, 'utf-8'));
    const { client_id, client_secret, redirect_uris } = credentials.installed || credentials.web;

    const oauth2Client = new OAuth2Client(
      client_id,
      client_secret,
      redirect_uris[0]
    );

    // Refresh token'ı direkt .env'den al
    const refreshToken = tokens.refresh_token;
    if (!refreshToken) {
      throw new Error('GOOGLE_REFRESH_TOKEN yapılandırması eksik.');
    }

    oauth2Client.setCredentials({
      refresh_token: refreshToken,
      scope: SCOPES.join(' '),
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
      const senderEmail = this.configService.get<string>('SENDER_EMAIL');
      if (!senderEmail) {
        throw new Error('SENDER_EMAIL yapılandırması eksik.');
      }

      // Email içeriğini oluşturuyoruz
      const emailLines = [
        `From: ${senderEmail}`,
        `To: ${toEmail}`,
        'Subject: Flow360 Notification',
        '',
        message,
      ];
      const emailContent = emailLines.join('\n');

      // Mesajı Base64 (URL-safe) formatına çeviriyoruz
      const encodedMessage = Buffer.from(emailContent)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      // Gmail API üzerinden mesajı gönderiyoruz
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
}
