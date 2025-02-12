import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IPList, IPListType } from '../entities/ip-list.entity';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(IPList)
    private ipListRepository: Repository<IPList>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'gizli-anahtar',
    });
  }

  async validate(payload: any, req: Request) {
    const clientIp = req.ip;
    
    // Önce blacklist kontrolü
    const isBlacklisted = await this.ipListRepository.findOne({
      where: {
        ip: clientIp,
        type: IPListType.BLACKLIST
      }
    });

    if (isBlacklisted) {
      throw new UnauthorizedException('Bu IP adresi engellenmiş.');
    }

    // Whitelist var mı diye kontrol
    const hasWhitelist = await this.ipListRepository.findOne({
      where: {
        type: IPListType.WHITELIST
      }
    });

    // Eğer whitelist varsa ve bu IP whitelistte değilse erişimi engelle
    if (hasWhitelist) {
      const isWhitelisted = await this.ipListRepository.findOne({
        where: {
          ip: clientIp,
          type: IPListType.WHITELIST
        }
      });

      if (!isWhitelisted) {
        throw new UnauthorizedException('Bu IP adresi yetkilendirilmemiş.');
      }
    }

    return { userId: payload.sub, nickname: payload.nickname };
  }
}
