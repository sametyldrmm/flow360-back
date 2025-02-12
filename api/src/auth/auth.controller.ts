import { Controller, Post, Body, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';
import { RateLimitGuard } from '../security/guards/rate-limit.guard';

@ApiTags('Auth')
@Controller('auth')
@UseGuards(RateLimitGuard)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(RateLimitGuard)
  async login(@Body() loginDto: LoginDto) {
    console.log(loginDto);

    const user = await this.authService.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Geçersiz kimlik bilgileri');
    }
    
    const result = await this.authService.login(user);
    return {
      statusCode: 200,
      message: 'Giriş başarılı',
      ...result
    };
  }
} 