import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { Logger } from '@nestjs/common';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.userService.findByEmail(email);
      
      if (!user) {
        throw new UnauthorizedException('Kullanıcı bulunamadı');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Şifre yanlış');
      }

      const { password: _, ...result } = user;
      return {
        ...result,
        role: user.role || 'user'
      };
    } catch (error) {
      this.logger.error(`Kullanıcı doğrulama hatası: ${error.message}`);
      throw new UnauthorizedException('Kimlik doğrulama başarısız');
    }
  }

  async login(user: any) {
    const payload = { 
      email: user.email, 
      id: user.id,
      role: user.role
    };
    
    this.logger.debug('Kullanıcı giriş yapıyor', { userId: user.id });
    
    return {
      access_token: this.jwtService.sign(payload)
    };
  }
} 