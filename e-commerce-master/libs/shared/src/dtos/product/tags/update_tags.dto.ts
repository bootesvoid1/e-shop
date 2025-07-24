import { PartialType } from '@nestjs/mapped-types';
import { CreateTagDto } from './create_tags.dto';

export class UpdateTagsDto extends PartialType(CreateTagDto) {}
