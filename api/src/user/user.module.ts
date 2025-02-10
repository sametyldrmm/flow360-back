import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Type } from '@sinclair/typebox';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
//import { Card } from 'src/card/entities/card.entity';
//import { CardService } from 'src/card/card.service';
//import { CardTwo } from 'src/card-two/entities/card-two.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User]),],
  controllers: [UserController],
  providers: [UserService],
  exports:[UserService],
})
export class UserModule {}
