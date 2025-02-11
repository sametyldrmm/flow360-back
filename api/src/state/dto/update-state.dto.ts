import { PartialType } from '@nestjs/mapped-types';
import { CreateStateDto } from './create-state.dto';

export class UpdateStateDto extends PartialType(CreateStateDto) {
  // Tüm alanlar opsiyonel olacak şekilde CreateStateDto'dan türetilir
} 