import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvModule } from './env/env.module';
import { TypeormModule } from './typeorm/typeorm.module';
import { UserModule } from './user/user.module';
import { MailModule } from './mail/mail.module';
import { AuthModule } from './auth/auth.module';
import { StateModule } from './state/state.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    EnvModule, TypeormModule, UserModule, MailModule,AuthModule, StateModule, ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

// Kanka update bir tane error durumu koyucaz eğerki statelerde  ....
  