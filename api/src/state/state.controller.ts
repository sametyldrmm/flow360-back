import { Controller, Get, Put, Body, Param, UseGuards, Patch, Request, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { StateService } from './state.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { State } from './entities/state.entity';
import { UpdateStateDto } from './dto/update-state.dto';

@Controller('state')
export class StateController {
  constructor(private readonly stateService: StateService) {}

  @Get(':userId')
  findByUserId(@Param('userId') userId: string) {
    return this.stateService.findByUserId(+userId);
  }

  @Patch(':userId')
  async updateState(
    @Param('userId') userId: string,
    @Body() updateStateDto: UpdateStateDto
  ) {
    try {
      return await this.stateService.update(+userId, updateStateDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('State bulunamadı');
      }
      throw new InternalServerErrorException('State güncellenirken bir hata oluştu');
    }
  }
}

