// create-variant.dto.ts
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateVariantValueDto } from './create-variant-values.dto';

export class CreateVariantDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  label: string;

  @IsEnum(['text', 'color'])
  @IsOptional() // Optional if you want to default to 'text' in backend
  type?: 'text' | 'color';

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVariantValueDto)
  values: CreateVariantValueDto[];
}
