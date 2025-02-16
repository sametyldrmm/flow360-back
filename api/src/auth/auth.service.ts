import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      // Normal kullanıcı kontrolü
      const user = await this.userService.findByEmail(email);
      if (!user) {
        throw new UnauthorizedException('Kullanıcı bulunamadı');
      }
      if (user.password !== password) {
        throw new UnauthorizedException('Şifre yanlış');
      }

      const { password: _, ...result } = user;
      return {
        ...result,
        role: user.role // Normal kullanıcılar için default rol
      };
    } catch (error) {
      console.error('Kullanıcı doğrulama hatası:', error);
      throw new UnauthorizedException('Kimlik doğrulama başarısız');
    }
  }

  async login(user: any) {
    const payload = { 
      email: user.email, 
      id: user.id,
      role: user.role
    };
    
    // log koy

    const access_token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET
    });
    return {
      access_token
    };
  }
} 