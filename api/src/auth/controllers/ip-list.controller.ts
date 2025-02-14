import { Controller, Get, Post, Body, Delete, Param, UseGuards, Logger } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { IPListService } from '../services/ip-list.service';
import { IPListType } from '../entities/ip-list.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('IP List')
@Controller('ip-list')
//@UseGuards(JwtAuthGuard)
export class IPListController {
  private readonly logger = new Logger(IPListController.name);

  constructor(private readonly ipListService: IPListService) {}

  @Post()
  async addIp(@Body() data: { ip: string; type: IPListType; description?: string }) {
    this.logger.log(`Yeni IP ekleniyor: ${data.ip}, Tip: ${data.type}`);
    return this.ipListService.addIp(data);
  }

  @Delete(':id')
  async removeIp(@Param('id') id: number) {
    this.logger.log(`IP siliniyor, ID: ${id}`);
    return this.ipListService.removeIp(id);
  }

  @Get()
  async getAllIps() {
    this.logger.log('Tüm IP listesi görüntüleniyor');
    return this.ipListService.findAll();
  }

  @Get('blacklist')
  async getBlacklist() {
    this.logger.log('Kara listedeki IP\'ler görüntüleniyor');
    const allIps = await this.ipListService.findAll();
    const blacklistedIps = allIps.filter(ip => ip.type === IPListType.BLACKLIST);
    
    return {
      statusCode: 200,
      data: blacklistedIps
    };
  }
} 