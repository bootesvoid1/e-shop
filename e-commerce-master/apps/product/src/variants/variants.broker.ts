import { Controller } from '@nestjs/common';
import { VariantsService } from './variants.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateVariantDto } from '@app/shared/dtos/product/variants/create-variant.dto';
import { UpdateVariantsDto } from '@app/shared/dtos/product/variants/update-variant.dto';

@Controller('variants')
export class VariantsBroker {
  constructor(private readonly variantService: VariantsService) {}
  @MessagePattern({ cmd: 'variants_create' })
  async create(@Payload() payload: CreateVariantDto) {
    try {
      const result = await this.variantService.create(payload);
      return result;
    } catch (error) {
      console.error('[CategoryMicroservice] Failed to create category:', error);
      throw error; // Let NestJS serialize it properly
    }
  }

  @MessagePattern({ cmd: 'variants_findAll' })
  async findAll(
    @Payload() payload: { page: number; limit: number; query: any },
  ) {
    return await this.variantService.findAll(payload);
  }

  @MessagePattern({ cmd: 'variants_findAll_unpaginated' })
  async findAllUnpaginated() {
    return await this.variantService.findUnpaginated();
  }
  @MessagePattern({ cmd: 'variants_findOne' })
  async findOne(id: string) {
    return await this.variantService.findOne(id);
  }

  @MessagePattern({ cmd: 'variants_update' })
  async update(
    @Payload() payload: { id: string; updateVariantsDto: UpdateVariantsDto },
  ) {
    return await this.variantService.update(payload);
  }

  @MessagePattern({ cmd: 'variants_delete' })
  async delete(@Payload() id: string) {
    return await this.variantService.delete(id);
  }
}
