import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { StateService } from './state.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { State } from './entities/state.entity';

@Controller('state')
@UseGuards(JwtAuthGuard)
export class StateController {
  constructor(private readonly stateService: StateService) {}

  @Get(':userId')
  findByUserId(@Param('userId') userId: string) {
    return this.stateService.findByUserId(+userId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateData: Partial<State>) {
    return this.stateService.update(+id, updateData);
  }
}

