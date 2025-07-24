import { Controller } from '@nestjs/common';
import { TagsService } from './tags.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateTagDto } from '@app/shared/dtos/product/tags/create_tags.dto';
import { UpdateTagsDto } from '@app/shared/dtos/product/tags/update_tags.dto';

@Controller('tags')
export class TagsBroker {
  constructor(private readonly tagsService: TagsService) {}
  @MessagePattern({ cmd: 'tags_create' })
  async create(@Payload() payload: CreateTagDto) {
    return this.tagsService.create(payload);
  }

  @MessagePattern({ cmd: 'tags_findAll' })
  async findAll(
    @Payload() payload: { page: number; limit: number; query: any },
  ) {
    return this.tagsService.findAll(payload);
  }

  @MessagePattern({ cmd: 'tags_findAll_unpaginated' })
  async findAllUnpaginated() {
    return await this.tagsService.findUnpaginated();
  }
  @MessagePattern({ cmd: 'tags_findOne' })
  async findOne(@Payload() payload: string) {
    return this.tagsService.findOne(payload);
  }

  @MessagePattern({ cmd: 'tags_update' })
  async update(@Payload() payload: { id: string; payload: UpdateTagsDto }) {
    return this.tagsService.update(payload);
  }

  @MessagePattern({ cmd: 'tags_delete' })
  async delete(@Payload() payload: string) {
    return this.tagsService.delete(payload);
  }
}
