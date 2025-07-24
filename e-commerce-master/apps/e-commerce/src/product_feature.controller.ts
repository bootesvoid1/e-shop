import { CreateFeatureDto } from '@app/shared/dtos/product/_features/create_feature.dto';
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
import { UpdateFeatureDto } from '@app/shared/dtos/product/_features/update_feature.dto';

@Controller('product_feature')
export class ProductFeatureController {
  constructor(
    @Inject('PRODUCT_SERVICE') private readonly featureClient: ClientProxy,
  ) {}

  @Post()
  async create(@Body() payload: CreateFeatureDto) {
    return lastValueFrom(
      this.featureClient.send({ cmd: 'feature_create' }, payload),
    );
  }

  @Post('all')
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
    @Body() query: any,
  ) {
    return lastValueFrom(
      this.featureClient.send(
        { cmd: 'feature_findAll' },
        { page, limit, query },
      ),
    );
  }
  @Get()
  findAllUnpaginated() {
    return lastValueFrom(
      this.featureClient.send({ cmd: 'features_findAll_unpaginated' }, {}),
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return lastValueFrom(
      this.featureClient.send({ cmd: 'feature_findOne' }, id),
    );
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() payload: UpdateFeatureDto) {
    return lastValueFrom(
      this.featureClient.send({ cmd: 'feature_update' }, { id, payload }),
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return lastValueFrom(
      this.featureClient.send({ cmd: 'feature_delete' }, id),
    );
  }
}
