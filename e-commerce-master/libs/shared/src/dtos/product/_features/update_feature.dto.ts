import { PartialType } from '@nestjs/mapped-types';
import { CreateFeatureDto } from './create_feature.dto';

export class UpdateFeatureDto extends PartialType(CreateFeatureDto) {}
