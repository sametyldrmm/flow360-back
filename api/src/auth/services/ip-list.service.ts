import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IPList, IPListType } from '../entities/ip-list.entity';

@Injectable()
export class IPListService {
  constructor(
    @InjectRepository(IPList)
    private ipListRepository: Repository<IPList>,
  ) {}

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
} 