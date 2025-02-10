import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';

describe('MailService', () => {
  let service: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailService],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendEmail', () => {
    it('should send email successfully', async () => {
      const result = await service.sendEmail(
        'test@example.com',
        'Test message'
      );
      expect(result).toBe(true);
    });
  });

  describe('refreshAccessToken', () => {
    it('should refresh token successfully', async () => {
      const result = await service.refreshAccessToken();
      expect(result).toBeDefined();
      expect(result.accessToken).toBeDefined();
      expect(result.tokenType).toBe('Bearer');
    });
  });
}); 