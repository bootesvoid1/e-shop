import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Inject,
  UseGuards,
} from '@nestjs/common';
import { CreateProductDto } from '@app/shared/dtos/product/create-product.dto';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { UpdateProductDto } from '@app/shared/dtos/product/update-product.dto';
import { JwtAuthGuard } from '@app/auth/JwtAuth.guard';

@Controller('products')
export class ProductController {
  constructor(
    @Inject('PRODUCT_SERVICE') private readonly productClient: ClientProxy,
  ) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return await lastValueFrom(
      this.productClient.send({ cmd: 'product_create' }, createProductDto),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('all')
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
    @Body() query: any,
  ) {
    return lastValueFrom(
      this.productClient.send(
        { cmd: 'product_find_all' },
        { page, limit, query },
      ),
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await lastValueFrom(
      this.productClient.send({ cmd: 'product_find_one' }, id),
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return await lastValueFrom(
      this.productClient.send(
        { cmd: 'product_patch' },
        { id: id, updateProductDto: updateProductDto },
      ),
    );
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    return await lastValueFrom(
      this.productClient.send({ cmd: 'product_delete' }, id),
    );
  }
}
