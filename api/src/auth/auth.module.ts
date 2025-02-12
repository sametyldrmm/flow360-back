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

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'gizli-anahtar',
      signOptions: { expiresIn: '1d' },
    }),
    TypeOrmModule.forFeature([IPList]),
  ],
  providers: [AuthService, JwtStrategy, IPListService],
  controllers: [AuthController, IPListController],
  exports: [AuthService],
})
export class AuthModule {} 