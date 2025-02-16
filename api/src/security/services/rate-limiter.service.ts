import { Injectable } from '@nestjs/common';

interface RateLimit {
  count: number;
  firstRequest: number;
}

interface FailedAttempt {
  count: number;
  timestamp: number;
}

@Injectable()
export class RateLimiterService {
  private readonly WINDOW_SIZE_IN_SECONDS = 60; // 1 dakika
  private readonly MAX_REQUESTS_PER_WINDOW = 100; // 1 dakikada maksimum istek
  private readonly MAX_FAILED_ATTEMPTS = 5; // Kara listeye eklenmeden önceki maksimum başarısız deneme
  private readonly BLACKLIST_DURATION = 24 * 60 * 60 * 1000; // 24 saat (milisaniye cinsinden)

  private rateLimits: Map<string, RateLimit> = new Map();
  private failedAttempts: Map<string, FailedAttempt> = new Map();
  private blacklist: Map<string, number> = new Map();

  async checkRateLimit(ip: string): Promise<{ success: boolean }> {
    const now = Date.now();
    const rateLimit = this.rateLimits.get(ip) || { count: 0, firstRequest: now };
    // Pencere süresini kontrol et ve gerekirse sıfırla
    if (now - rateLimit.firstRequest > this.WINDOW_SIZE_IN_SECONDS * 1000) {
      rateLimit.count = 0;
      rateLimit.firstRequest = now;
    }

    rateLimit.count++;
    console.log(rateLimit.count);
    this.rateLimits.set(ip, rateLimit);

    if (rateLimit.count > this.MAX_REQUESTS_PER_WINDOW ) {
      await this.incrementFailedAttempts(ip);
      return { success: false };
    }

    return { success: true };
  }

  private async incrementFailedAttempts(ip: string): Promise<void> {
    const now = Date.now();
    const attempt = this.failedAttempts.get(ip) || { count: 0, timestamp: now };

    // 5 dakikalık pencere kontrolü
    if (now - attempt.timestamp > 5 * 60 * 1000) {
      attempt.count = 0;
      attempt.timestamp = now;
    }

    attempt.count++;
    this.failedAttempts.set(ip, attempt);

    if (attempt.count >= this.MAX_FAILED_ATTEMPTS) {
      await this.addToBlacklist(ip);
    }
  }

  async addToBlacklist(ip: string): Promise<void> {
    this.blacklist.set(ip, Date.now() + this.BLACKLIST_DURATION);
  }

  async isBlacklisted(ip: string): Promise<boolean> {
    const expirationTime = this.blacklist.get(ip);
    if (!expirationTime) return false;

    if (Date.now() > expirationTime) {
      this.blacklist.delete(ip);
      return false;
    }

    return true;
  }

  // Temizlik işlemi için (opsiyonel)
  private cleanupOldEntries() {
    const now = Date.now();

    // Eski rate limit kayıtlarını temizle
    for (const [ip, rateLimit] of this.rateLimits.entries()) {
      if (now - rateLimit.firstRequest > this.WINDOW_SIZE_IN_SECONDS * 1000) {
        this.rateLimits.delete(ip);
      }
    }

    // Eski failed attempts kayıtlarını temizle
    for (const [ip, attempt] of this.failedAttempts.entries()) {
      if (now - attempt.timestamp > 5 * 60 * 1000) {
        this.failedAttempts.delete(ip);
      }
    }

    // Süresi dolmuş blacklist kayıtlarını temizle
    for (const [ip, expiration] of this.blacklist.entries()) {
      if (now > expiration) {
        this.blacklist.delete(ip);
      }
    }
  }
} 