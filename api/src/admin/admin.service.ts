import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RateLimiterService } from '../security/services/rate-limiter.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { LoginAdminDto } from './dto/login-admin.dto';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AdminService {
  private readonly ADMIN_EMAIL = 'admin@admin.com';
  private readonly ADMIN_PASSWORD = 'admin';
  constructor(
    private readonly userService: UserService,
    private readonly rateLimiterService: RateLimiterService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly authService: AuthService,
  ) {}

  async getAllUsers() {
    return this.userService.findAll();
  }

  /*async getSystemStats() {
    // Sistem istatistiklerini döndür
    return {
      totalUsers: await this.userService.count(),
      // Diğer istatistikler...
    };
  }
*/
  async blacklistIP(ip: string) {
    await this.rateLimiterService.addToBlacklist(ip);
    return { message: 'IP kara listeye eklendi' };
  }

  async removeFromBlacklist(ip: string) {
    // RateLimiterService'e removeFromBlacklist metodu eklenebilir
    return { message: 'IP kara listeden çıkarıldı' };
  }

  async login(email: string, password: string) {
    
    if (!this.isValidAdminEmail(email)) {
      throw new UnauthorizedException('Geçersiz admin email adresi');
    }
    if (!this.validateAdminPassword(email, password)) {
      throw new UnauthorizedException('Geçersiz şifre');
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();    
    await this.mailService.sendEmail(email, `Admin giriş şifreniz: ${verificationCode}`);

    return { message: 'Doğrulama şifresi e-posta adresinize gönderildi' };
  }

  async verifyLogin(email: string, verificationCode: string, password: string) {
    try {
      await this.mailService.verifyPasswordResetCode(email, verificationCode);
      return { message: 'Doğrulama başarılı' };
    } catch (error) {
      throw new UnauthorizedException('Doğrulama başarısız');
    }

  }

  private isValidAdminEmail(email: string): boolean {
    const admin1Email = this.configService.get<string>('ADMIN_EMAIL_1');
    const admin2Email = this.configService.get<string>('ADMIN_EMAIL_2');
    
    return email === admin1Email || email === admin2Email;
  }

  private validateAdminPassword(email: string, password: string): boolean {
    const admin1Email = this.configService.get<string>('ADMIN_EMAIL_1');
    const admin1Password = this.configService.get<string>('ADMIN_PASSWORD_1');
    const admin2Email = this.configService.get<string>('ADMIN_EMAIL_2');
    const admin2Password = this.configService.get<string>('ADMIN_PASSWORD_2');

    return (
      (email === admin1Email && password === admin1Password) ||
      (email === admin2Email && password === admin2Password)
    );
  }
} 