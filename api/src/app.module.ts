import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
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
import { SecurityModule } from './security/security.module';
import { AdminModule } from './admin/admin.module';
import { SecurityMiddleware } from './security/middleware/security.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    EnvModule, TypeormModule, UserModule, MailModule,AuthModule, StateModule, ScheduleModule.forRoot(), SecurityModule, AdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SecurityMiddleware)
      .forRoutes('*');
  }
}

// Kanka update bir tane error durumu koyucaz eğerki statelerde  ....
  