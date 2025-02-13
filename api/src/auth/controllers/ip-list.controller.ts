import { Controller, Get, Post, Body, Delete, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { IPListService } from '../services/ip-list.service';
import { IPListType } from '../entities/ip-list.entity';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IPListDto } from '../dto/ip-list.dto';

@ApiTags('IP List')
@ApiBearerAuth()
@Controller('ip-list')
@UseGuards(JwtAuthGuard)
export class IPListController {
  constructor(private readonly ipListService: IPListService) {}

  @ApiOperation({ summary: 'IP ekle' })
  @ApiResponse({ status: 201, description: 'IP başarıyla eklendi' })
  @Post()
  async addIp(@Body() data: IPListDto) {
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