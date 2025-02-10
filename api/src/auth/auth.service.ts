import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
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
        if (user.password !== password) {
            throw new UnauthorizedException('Şifre yanlış');
        }

        const { password: _, ...result } = user;
        return result;
    } catch (error) {
        console.error('Kullanıcı doğrulama hatası:', error);
        throw new UnauthorizedException('Kimlik doğrulama başarısız');
    }
  }

  async login(user: any) {
    try {
        
        const payload = { email: user.email, sub: user.id };
        const access_token = this.jwtService.sign(payload);

        return {
            access_token,
            user: {
                id: user.id,
                email: user.email,
            }
        };
    } catch (error) {
        console.error('Girsiş hatası:', error);
        throw new UnauthorizedException('Giriş işlemi başarısız');
    }
  }
} 