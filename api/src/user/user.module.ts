import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Type } from '@sinclair/typebox';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { State } from '../state/entities/state.entity';
import { PasswordResetCode } from './entities/password-reset.entity';
//import { Card } from 'src/card/entities/card.entity';
//import { CardService } from 'src/card/card.service';
//import { CardTwo } from 'src/card-two/entities/card-two.entity';
import { StateModule } from '../state/state.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, State, PasswordResetCode]),
    StateModule,
    MailModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports:[UserService],
})
export class UserModule {}
