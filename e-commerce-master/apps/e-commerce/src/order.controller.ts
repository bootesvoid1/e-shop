import { JwtAuthGuard } from '@app/auth/JwtAuth.guard';
import { CreateOrderDto } from '@app/shared/dtos/transaction/order/create-order.dto';

import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Controller('order')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(
    @Inject('TRANSACTION_SERVICE') private readonly orderClient: ClientProxy,
  ) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    return await lastValueFrom(
      this.orderClient.send({ cmd: 'order_create' }, createOrderDto),
    );
  }

  @Post('all')
  async findPaginated(
    @Req() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
    @Body() query: any,
  ) {
    return await lastValueFrom(
      this.orderClient.send({ cmd: 'order_find_all' }, { page, limit, query }),
    );
  }
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await lastValueFrom(
      this.orderClient.send({ cmd: 'order_find_one' }, id),
    );
  }
}
