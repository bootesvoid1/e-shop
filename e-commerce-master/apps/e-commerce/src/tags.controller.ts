import { CreateTagDto } from '@app/shared/dtos/product/tags/create_tags.dto';
import { UpdateTagsDto } from '@app/shared/dtos/product/tags/update_tags.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Controller('tags')
export class TagsController {
  constructor(
    @Inject('PRODUCT_SERVICE') private readonly tagsClient: ClientProxy,
  ) {}

  @Post() async create(@Body() payload: CreateTagDto) {
    return lastValueFrom(this.tagsClient.send({ cmd: 'tags_create' }, payload));
  }

  @Post('all')
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
    @Body() query: any,
  ) {
    return lastValueFrom(
      this.tagsClient.send({ cmd: 'tags_findAll' }, { page, limit, query }),
    );
  }

  @Get()
  findAllUnpaginated() {
    return lastValueFrom(
      this.tagsClient.send({ cmd: 'tags_findAll_unpaginated' }, {}),
    );
  }
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return lastValueFrom(this.tagsClient.send({ cmd: 'tags_findOne' }, id));
  }
  @Patch(':id')
  async update(@Param('id') id: string, @Body() payload: UpdateTagsDto) {
    return lastValueFrom(
      this.tagsClient.send({ cmd: 'tags_update' }, { id, payload }),
    );
  }
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return lastValueFrom(this.tagsClient.send({ cmd: 'tags_delete' }, id));
  }
}
