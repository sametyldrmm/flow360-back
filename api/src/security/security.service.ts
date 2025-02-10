import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SecurityService {
  private readonly logger = new Logger(SecurityService.name);
  private readonly apiKey: string;
  private readonly apiEndpoint = 'https://safebrowsing.googleapis.com/v4/threatMatches:find';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('GOOGLE_SAFE_BROWSING_API_KEY');
  }

  async checkUrl(url: string): Promise<boolean> {
    try {
      const payload = {
        client: {
          clientId: 'your-client-name',
          clientVersion: '1.0.0',
        },
        threatInfo: {
          threatTypes: [
            'MALWARE',
            'SOCIAL_ENGINEERING',
            'UNWANTED_SOFTWARE',
            'POTENTIALLY_HARMFUL_APPLICATION',
          ],
          platformTypes: ['ANY_PLATFORM'],
          threatEntryTypes: ['URL'],
          threatEntries: [{ url }],
        },
      };

      const response = await firstValueFrom(
        this.httpService.post(
          `${this.apiEndpoint}?key=${this.apiKey}`,
          payload,
        ),
      );

      // Eğer matches boş ise URL güvenli demektir
      return !response.data.matches || response.data.matches.length === 0;
    } catch (error) {
      this.logger.error(`URL güvenlik kontrolü sırasında hata: ${error.message}`);
      throw error;
    }
  }
} 