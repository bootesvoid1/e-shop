import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from '@app/shared/dtos/product/category/create-category.dto';
import { UpdateCategoryDto } from '@app/shared/dtos/product/category/update-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @MessagePattern({ cmd: 'category_create' })
  async create(@Payload() payload: CreateCategoryDto) {
    try {
      const result = await this.categoryService.create(payload);
      return result;
    } catch (error) {
      console.error('[CategoryMicroservice] Failed to create category:', error);
      throw error; // Let NestJS serialize it properly
    }
  }

  @MessagePattern({ cmd: 'category_findAll' })
  async findAll(
    @Payload() payload: { page: number; limit: number; query: any },
  ) {
    return await this.categoryService.findAll(payload);
  }

  @MessagePattern({ cmd: 'category_findAll_unpaginated' })
  async findAllUnpaginated() {
    return await this.categoryService.findUnpaginated();
  }
  @MessagePattern({ cmd: 'category_findOne' })
  async findOne(id: string) {
    return await this.categoryService.findOne(id);
  }

  @MessagePattern({ cmd: 'category_update' })
  async update(
    @Payload() payload: { id: string; updateCategoryDto: UpdateCategoryDto },
  ) {
    return await this.categoryService.update(payload);
  }

  @MessagePattern({ cmd: 'category_delete' })
  async delete(@Payload() id: string) {
    return await this.categoryService.delete(id);
  }
}
