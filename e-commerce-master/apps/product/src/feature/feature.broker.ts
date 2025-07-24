import { UpdateFeatureDto } from '@app/shared/dtos/product/_features/update_feature.dto';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FeatureService } from './feature.service';
import { CreateFeatureDto } from '@app/shared/dtos/product/_features/create_feature.dto';

@Controller('feature')
export class FeatureBroker {
  constructor(private readonly featureService: FeatureService) {}

  @MessagePattern({ cmd: 'feature_create' })
  async create(@Payload() payload: CreateFeatureDto) {
    return this.featureService.create(payload);
  }

  @MessagePattern({ cmd: 'feature_findAll' })
  async findAll(
    @Payload() payload: { page: number; limit: number; query: any },
  ) {
    return this.featureService.findAll(payload);
  }
  @MessagePattern({ cmd: 'features_findAll_unpaginated' })
  async findAllUnpaginated() {
    return await this.featureService.findUnpaginated();
  }

  @MessagePattern({ cmd: 'feature_findOne' })
  async findOne(@Payload() payload: string) {
    return this.featureService.findOne(payload);
  }

  @MessagePattern({ cmd: 'feature_update' })
  async update(@Payload() payload: { id: string; payload: UpdateFeatureDto }) {
    return this.featureService.update(payload);
  }

  @MessagePattern({ cmd: 'feature_delete' })
  async delete(@Payload() payload: string) {
    return this.featureService.delete(payload);
  }
}
