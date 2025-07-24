import { CreateOrderDto } from '@app/shared/dtos/transaction/order/create-order.dto';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrderService } from './order.service';

@Controller('order')
export class OrderBroker {
  constructor(private readonly orderService: OrderService) {}

  @MessagePattern({ cmd: 'order_create' })
  async create(@Payload() payload: CreateOrderDto) {
    return await this.orderService.create(payload);
  }

  @MessagePattern({ cmd: 'order_find_all' })
  async findAll(
    @Payload()
    payload: {
      page: number;
      limit: number;
      query: any;
    },
  ) {
    return this.orderService.findAllPaginated(payload);
  }
}
