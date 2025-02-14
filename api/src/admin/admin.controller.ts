import { Controller, Get, Post, Body, UseGuards, Delete, Param, Put, Logger } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { LoginAdminDto } from './dto/login-admin.dto';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  private readonly logger = new Logger(AdminController.name);

  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  async getAllUsers() {
    this.logger.log('Admin: Tüm kullanıcılar listeleniyor');
    return this.adminService.getAllUsers();
  }

/*
  @Get('stats')
  async getSystemStats() {
    return this.adminService.getSystemStats();
  }
*/
  @Get('blacklist/ip')
  async getBlacklist() {
    this.logger.log('IP kara listesi görüntüleniyor');
    return this.adminService.getBlacklist();
  }
  @Post('blacklist/ip')
  async blacklistIP(@Body() body: { ip: string }) {
    this.logger.log(`IP adresi karalisteye ekleniyor: ${body.ip}`);
    return this.adminService.blacklistIP(body.ip);
  }

  @Delete('blacklist/ip/:ip')
  async removeFromBlacklist(@Param('ip') ip: string) {
    this.logger.log(`IP adresi karalisteden çıkarılıyor: ${ip}`);
    return this.adminService.removeFromBlacklist(ip);
  }

  @Post('login')
  async login(@Body() loginAdminDto: LoginAdminDto) {
    this.logger.log(`Admin giriş denemesi: ${loginAdminDto.email}`);
    return this.adminService.login(loginAdminDto.email, loginAdminDto.password);
  }

  @Post('login/verify')
  async verifyLogin(@Body() body: { email: string, verificationCode: string, password: string }) {
    this.logger.log(`Admin giriş doğrulama denemesi: ${body.email}`);
    return this.adminService.verifyLogin(body.email, body.verificationCode, body.password);
  }

} 