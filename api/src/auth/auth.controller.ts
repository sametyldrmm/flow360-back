import { Controller, Post, Body, UnauthorizedException, UseGuards, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';
import { IpTrackingGuard } from './guards/ip-tracking.guard';

@ApiTags('Auth')
@Controller('auth')
@UseGuards(IpTrackingGuard)
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(IpTrackingGuard)
  async login(@Body() loginDto: LoginDto) {
    console.log("loginDto",loginDto);
    this.logger.log(`Giriş denemesi: ${loginDto.email}`);

    const user = await this.authService.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      this.logger.warn(`Başarısız giriş denemesi: ${loginDto.email}`);
      throw new UnauthorizedException('Geçersiz kimlik bilgileri');
    }
    
    this.logger.log(`Başarılı giriş: ${loginDto.email} , ${user.role}`);
    const result = await this.authService.login(user);
    return {
      statusCode: 200,
      message: 'Giriş başarılı',
      ...result
    };
  }
} 