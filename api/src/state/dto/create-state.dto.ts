import { IsBoolean, IsString } from 'class-validator';

export class CreateStateDto {
  @IsBoolean()
  formState: boolean;

  @IsString()
  voteState: string;

  @IsBoolean()
  priceState: boolean;
}
