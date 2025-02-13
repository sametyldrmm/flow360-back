import { Injectable, OnModuleInit, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { IPList, IPListType } from '../entities/ip-list.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class IPListService implements OnModuleInit {
  constructor(
    @InjectRepository(IPList)
    private ipListRepository: Repository<IPList>,
  ) {}

  async onModuleInit() {
    // Başlangıçta eski kayıtları temizle
    await this.cleanupBlacklist();
  }

  async addIp(data: { ip: string; type: IPListType; description?: string }) {
    const ipList = this.ipListRepository.create(data);
    return this.ipListRepository.save(ipList);
  }

  async removeIp(id: number) {
    return this.ipListRepository.delete(id);
  }

  async findAll() {
    return this.ipListRepository.find();
  }

  async findByType(type: IPListType) {
    return this.ipListRepository.find({
      where: { type }
    });
  }

  // Her saat başı çalışacak cleanup işlemi
  @Cron(CronExpression.EVERY_HOUR)
  async cleanupBlacklist() {
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    await this.ipListRepository.delete({
      type: IPListType.BLACKLIST,
      createdAt: LessThan(twentyFourHoursAgo)
    });
  }

  @Get('blacklist')
  async getBlacklist() {
    const blacklistedIps = await this.findByType(IPListType.BLACKLIST);
    
    return {
      statusCode: 200,
      data: blacklistedIps
    };
  }
} 