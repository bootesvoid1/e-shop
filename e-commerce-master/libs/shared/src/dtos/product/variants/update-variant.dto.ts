import { PartialType } from '@nestjs/mapped-types';
import { CreateVariantDto } from './create-variant.dto';

export class UpdateVariantsDto extends PartialType(CreateVariantDto) {}
