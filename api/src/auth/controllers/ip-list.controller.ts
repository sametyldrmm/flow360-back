import { Controller, Get, Post, Body, Delete, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { IPListService } from '../services/ip-list.service';
import { IPListType } from '../entities/ip-list.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('IP List')
@Controller('ip-list')
//@UseGuards(JwtAuthGuard)
export class IPListController {
  constructor(private readonly ipListService: IPListService) {}

  @Post()
  async addIp(@Body() data: { ip: string; type: IPListType; description?: string }) {
    return this.ipListService.addIp(data);
  }

  @Delete(':id')
  async removeIp(@Param('id') id: number) {
    return this.ipListService.removeIp(id);
  }

  @Get()
  async getAllIps() {
    return this.ipListService.findAll();
  }

  @Get('blacklist')
  async getBlacklist() {
    const allIps = await this.ipListService.findAll();
    const blacklistedIps = allIps.filter(ip => ip.type === IPListType.BLACKLIST);
    
    return {
      statusCode: 200,
      data: blacklistedIps
    };
  }
} 