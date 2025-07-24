import { Controller } from '@nestjs/common';
import { CartService } from './cart.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateCartDto } from '@app/shared/dtos/cart/create-cart.dto';
import { UpdateCartDto } from '@app/shared/dtos/cart/update-cart.dto';

@Controller()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @MessagePattern({ cmd: 'cart_create' })
  async create(@Payload() payload: CreateCartDto) {
    return await this.cartService.create(payload);
  }

  @MessagePattern({ cmd: 'cart_get' })
  async findOne(@Payload() userId: string) {
    return await this.cartService.findOne(userId);
  }

  @MessagePattern({ cmd: 'cart_update' })
  async update(@Payload() payload: UpdateCartDto) {
    return await this.cartService.update(payload);
  }
}
