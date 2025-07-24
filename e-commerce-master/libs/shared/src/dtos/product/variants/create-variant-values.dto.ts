// create-variant-value.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateVariantValueDto {
  @IsString()
  @IsNotEmpty()
  label: string;
}
