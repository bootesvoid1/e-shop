import { PartialType } from '@nestjs/mapped-types';
import { CreateManufacturorDto } from './create-manufacturor.dto';

export class UpdateManufacturorDto extends PartialType(CreateManufacturorDto) {}
