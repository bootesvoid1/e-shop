import { CreateCategoryDto } from '@app/shared/dtos/product/category/create-category.dto';
import { UpdateCategoryDto } from '@app/shared/dtos/product/category/update-category.dto';
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

@Controller('category')
export class CategoryController {
  constructor(
    @Inject('PRODUCT_SERVICE') private readonly categoryClient: ClientProxy,
  ) {}

  @Post()
  async create(@Body() payload: CreateCategoryDto) {
    console.log('[API Gateway] Sending payload to microservice:', payload);
    try {
      return await lastValueFrom(
        this.categoryClient.send({ cmd: 'category_create' }, payload),
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
      this.categoryClient.send(
        { cmd: 'category_findAll' },
        { page, limit, query },
      ),
    );
  }

  @Get()
  findAllUnpaginated() {
    return lastValueFrom(
      this.categoryClient.send({ cmd: 'category_findAll_unpaginated' }, {}),
    );
  }
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return lastValueFrom(
      this.categoryClient.send({ cmd: 'category_findOne' }, id),
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return lastValueFrom(
      this.categoryClient.send(
        { cmd: 'category_update' },
        { id, updateCategoryDto },
      ),
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return lastValueFrom(
      this.categoryClient.send({ cmd: 'category_delete' }, id),
    );
  }
}
