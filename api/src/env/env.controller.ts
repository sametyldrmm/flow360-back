import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EnvService } from './env.service';
import { CreateEnvDto } from './dto/create-env.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Env")
@Controller('env')
export class EnvController {
  constructor(private readonly envService: EnvService) {}

  @Get()
  findAll() : CreateEnvDto {
    return this.envService.ret();
  }

}
