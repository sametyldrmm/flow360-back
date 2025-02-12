import { Controller, Get, Post, Body, Delete, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { IPListService } from '../services/ip-list.service';
import { IPListType } from '../entities/ip-list.entity';

@Controller('ip-list')
@UseGuards(JwtAuthGuard)
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
} 