import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserModule } from '../user/user.module';
import { IPList } from './entities/ip-list.entity';
import { IPListController } from './controllers/ip-list.controller';
import { IPListService } from './services/ip-list.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SecurityModule } from '../security/security.module';
import { IpTrackingStrategy } from './strategies/ip-tracking.strategy';
import { IpTrackingGuard } from './guards/ip-tracking.guard';
import { APP_GUARD } from '@nestjs/core';
import { RateLimitGuard } from '../security/guards/rate-limit.guard';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    UserModule,
    PassportModule,
    SecurityModule,
    ScheduleModule.forRoot(),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'gizli-anahtar',
      signOptions: { expiresIn: '1d' },
    }),
    TypeOrmModule.forFeature([IPList]),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    IPListService,
    IpTrackingStrategy,
    IpTrackingGuard,
    {
      provide: APP_GUARD,
      useClass: RateLimitGuard,
    }
  ],
  controllers: [AuthController, IPListController],
  exports: [AuthService],
})
export class AuthModule {} 