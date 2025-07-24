import { Controller, Get } from '@nestjs/common';
import { ProductService } from './product.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateProductDto } from '@app/shared/dtos/product/create-product.dto';
import { UpdateProductDto } from '@app/shared/dtos/product/update-product.dto';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @MessagePattern({ cmd: 'product_create' })
  async crateProduct(payload: CreateProductDto) {
    try {
      const result = await this.productService.create(payload);
      return result;
    } catch (error) {
      console.error('[CategoryMicroservice] Failed to create category:', error);
      throw error; // Let NestJS serialize it properly
    }
  }

  @MessagePattern({ cmd: 'product_find_all' })
  async findAll(
    @Payload() payload: { page: number; limit: number; query: any },
  ) {
    return await this.productService.findAll(payload);
  }

  @MessagePattern({ cmd: 'product_find_one' })
  async findOne(id: string) {
    return await this.productService.findOne(id);
  }

  @MessagePattern({ cmd: 'product_patch' })
  async update(
    @Payload() payload: { id: string; updateProductDto: UpdateProductDto },
  ) {
    return await this.productService.update(payload);
  }
}
