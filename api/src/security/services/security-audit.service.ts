import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class SecurityAuditService {
  private readonly logger = new Logger(SecurityAuditService.name);
  private readonly suspiciousPatterns = [
    /(\b)(on\S+)(\s*)=|javascript:|(<\s*)(\/*)script/i,
    /(document\.|window\.|eval\(|\[\s*\]\s*\[|\.\s*constructor)/i,
    /(exec|system|ping|chmod|wget|curl)/i
  ];

  checkForMaliciousContent(content: string): boolean {
    return this.suspiciousPatterns.some(pattern => pattern.test(content));
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async performSecurityAudit() {
    this.logger.log('Günlük güvenlik denetimi başlatılıyor...');
    // Burada günlük güvenlik kontrolleri yapılabilir
    // - Başarısız giriş denemelerinin analizi
    // - Şüpheli IP'lerin kontrolü
    // - Sistem kaynaklarının kontrolü
  }
} 