import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateVariantDto } from './variants/create-variant.dto';
import { CreateSpecificationGroupDto } from './specifications/create-specifications.dto';
import { CreateTagDto } from './tags/create_tags.dto';
import { CreateFeatureDto } from './_features/create_feature.dto';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  displayTitle: string;

  @IsString()
  @IsNotEmpty()
  SKU: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  price: number;

  @IsNumber()
  stock: number;

  @IsString()
  userId: string;

  @IsNumber()
  discount: number;

  @IsEnum(['active', 'inactive', 'archived'])
  @IsOptional()
  status?: 'active' | 'inactive' | 'archived';

  @IsNumber()
  categoryId: number;

  @IsOptional()
  @IsNumber()
  manufacturerId?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFeatureDto)
  @IsOptional()
  features?: CreateFeatureDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTagDto)
  @IsOptional()
  tags?: CreateTagDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DocumentInputDto)
  @IsOptional()
  documents?: DocumentInputDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVariantDto)
  @IsOptional()
  variants?: CreateVariantDto[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateSpecificationGroupDto)
  specificationGroups?: CreateSpecificationGroupDto[];
}

export class DocumentInputDto {
  @IsString()
  label: string;

  @IsString()
  url: string;
}
