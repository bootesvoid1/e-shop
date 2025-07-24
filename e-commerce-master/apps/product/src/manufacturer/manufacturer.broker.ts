import { CreateManufacturorDto } from '@app/shared/dtos/product/manufacturor/create-manufacturor.dto';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ManufacturorService } from './manufacturer.service';
import { UpdateManufacturorDto } from '@app/shared/dtos/product/manufacturor/update-manufacturor.dto';

@Controller('manufacturor')
export class ManufacturorBroker {
  constructor(private readonly manufacturorService: ManufacturorService) {}

  @MessagePattern({ cmd: 'manu_create' })
  async create(@Payload() payload: CreateManufacturorDto) {
    return this.manufacturorService.create(payload);
  }

  @MessagePattern({ cmd: 'manu_findAll' })
  async findAll(
    @Payload() payload: { page: number; limit: number; query: any },
  ) {
    return this.manufacturorService.findAll(payload);
  }

  @MessagePattern({ cmd: 'manu_findAll_unpaginated' })
  async findAllUnpaginated() {
    return await this.manufacturorService.findUnpaginated();
  }
  @MessagePattern({ cmd: 'manu_findOne' })
  async findOne(@Payload() payload: string) {
    return this.manufacturorService.findOne(payload);
  }

  @MessagePattern({ cmd: 'manu_update' })
  async update(
    @Payload()
    payload: {
      id: string;
      updateManufacturorDto: UpdateManufacturorDto;
    },
  ) {
    return this.manufacturorService.update(payload);
  }

  @MessagePattern({ cmd: 'manu_update' })
  async delete(
    @Payload()
    payload: string,
  ) {
    return this.manufacturorService.delete(payload);
  }
}
