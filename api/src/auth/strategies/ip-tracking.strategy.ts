import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { IPListService } from '../services/ip-list.service';
import { IPListType } from '../entities/ip-list.entity';

@Injectable()
export class IpTrackingStrategy extends PassportStrategy(Strategy, 'ip-tracking') {
  constructor(private ipListService: IPListService) {
    super();
  }

  async validate(req: any) {
    const ip = req.ip;
    
    // IP'nin daha önce kaydedilip kaydedilmediğini kontrol et
    const existingIp = await this.ipListService.findAll().then(
      ips => ips.find(record => record.ip === ip)
    );

    // Eğer IP daha önce kaydedilmemişse kaydet
    if (!existingIp) {
      await this.ipListService.addIp({
        ip,
        type: IPListType.WHITELIST,
        description: 'Sistem tarafından kaydedildi'
      });
    }

    return true;
  }
} 