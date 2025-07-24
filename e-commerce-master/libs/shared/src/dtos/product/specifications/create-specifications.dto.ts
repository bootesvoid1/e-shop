import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';

export class CreateSpecificationGroupDto {
  @IsString()
  name: string;

  @ValidateNested({ each: true })
  @Type(() => CreateSpecificationDto)
  specifications: CreateSpecificationDto[];
}

export class CreateSpecificationDto {
  @IsString()
  label: string;

  @IsString()
  value: string;
}
