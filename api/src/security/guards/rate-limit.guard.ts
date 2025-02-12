import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { RateLimiterService } from '../services/rate-limiter.service';

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(private readonly rateLimiterService: RateLimiterService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const ip = request.ip;

    const isBlacklisted = await this.rateLimiterService.isBlacklisted(ip);
    if (isBlacklisted) {
      throw new HttpException('IP kara listede', HttpStatus.TOO_MANY_REQUESTS);
    }

    const result = await this.rateLimiterService.checkRateLimit(ip);
    if (!result.success) {
      throw new HttpException('Çok fazla istek gönderildi', HttpStatus.TOO_MANY_REQUESTS);
    }

    return true;
  }
} 