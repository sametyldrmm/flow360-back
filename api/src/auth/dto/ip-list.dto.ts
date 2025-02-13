import { ApiProperty } from '@nestjs/swagger';
import { IPListType } from '../entities/ip-list.entity';

export class IPListDto {
    @ApiProperty()
    ip: string;

    @ApiProperty({ enum: IPListType })
    type: IPListType;
} 