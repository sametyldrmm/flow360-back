import { Module } from '@nestjs/common';
import { SecurityService } from './security.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [SecurityService],
  exports: [SecurityService],
})

export class SecurityModule {} 
