import { CreateManufacturorDto } from '@app/shared/dtos/product/manufacturor/create-manufacturor.dto';
import { UpdateManufacturorDto } from '@app/shared/dtos/product/manufacturor/update-manufacturor.dto';
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

@Controller('manufacturor')
export class ManufacturorController {
  constructor(
    @Inject('PRODUCT_SERVICE') private readonly manufacturorClient: ClientProxy,
  ) {}

  @Post()
  async create(@Body() payload: CreateManufacturorDto) {
    return lastValueFrom(
      this.manufacturorClient.send({ cmd: 'manu_create' }, payload),
    );
  }

  @Post('all')
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
    @Body() query: any,
  ) {
    return lastValueFrom(
      this.manufacturorClient.send(
        { cmd: 'manu_findAll' },
        { page, limit, query },
      ),
    );
  }

  @Get()
  findAllUnpaginated() {
    return lastValueFrom(
      this.manufacturorClient.send({ cmd: 'manu_findAll_unpaginated' }, {}),
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return lastValueFrom(
      this.manufacturorClient.send({ cmd: 'manu_findOne' }, id),
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateManufacturorDto: UpdateManufacturorDto,
  ) {
    return lastValueFrom(
      this.manufacturorClient.send(
        { cmd: 'manu_update' },
        { id, updateManufacturorDto },
      ),
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return lastValueFrom(
      this.manufacturorClient.send({ cmd: 'manu_findAll' }, id),
    );
  }
}
