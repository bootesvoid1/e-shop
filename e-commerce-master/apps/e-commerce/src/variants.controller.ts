import { CreateVariantDto } from '@app/shared/dtos/product/variants/create-variant.dto';
import { UpdateVariantsDto } from '@app/shared/dtos/product/variants/update-variant.dto';
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

@Controller('variants')
export class VariantsController {
  constructor(
    @Inject('PRODUCT_SERVICE') private readonly variantsClient: ClientProxy,
  ) {}

  @Post()
  async create(@Body() payload: CreateVariantDto) {
    console.log('[API Gateway] Sending payload to microservice:', payload);
    try {
      return await lastValueFrom(
        this.variantsClient.send({ cmd: 'variants_create' }, payload),
      );
    } catch (error) {
      console.error('[API Gateway] Microservice Error:', error);
      throw error; // Optionally wrap it in HttpException if needed
    }
  }

  @Post('all')
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
    @Body() query: any,
  ) {
    return lastValueFrom(
      this.variantsClient.send(
        { cmd: 'variants_findAll' },
        { page, limit, query },
      ),
    );
  }

  @Get()
  findAllUnpaginated() {
    return lastValueFrom(
      this.variantsClient.send({ cmd: 'variants_findAll_unpaginated' }, {}),
    );
  }
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return lastValueFrom(
      this.variantsClient.send({ cmd: 'variants_findOne' }, id),
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateVariantsDto: UpdateVariantsDto,
  ) {
    return lastValueFrom(
      this.variantsClient.send(
        { cmd: 'variants_update' },
        { id, updateVariantsDto },
      ),
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return lastValueFrom(
      this.variantsClient.send({ cmd: 'variants_delete' }, id),
    );
  }
}
