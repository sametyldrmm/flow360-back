import { Injectable } from '@nestjs/common';
import { CreateEnvDto } from './dto/create-env.dto';

@Injectable()
export class EnvService {
  ret() : CreateEnvDto {
    return new CreateEnvDto();
  }

}
