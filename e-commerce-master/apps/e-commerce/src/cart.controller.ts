import { JwtAuthGuard } from '@app/auth/JwtAuth.guard';
import { CreateCartDto } from '@app/shared/dtos/cart/create-cart.dto';
import { UpdateCartDto } from '@app/shared/dtos/cart/update-cart.dto';
import {
  Body,
  Controller,
  Get,
  Inject,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(
    @Inject('TRANSACTION_SERVICE') private readonly cartClient: ClientProxy,
  ) {}

  @Post()
  async create(@Body() createCartDto: CreateCartDto) {
    return await lastValueFrom(
      this.cartClient.send({ cmd: 'cart_create' }, createCartDto),
    );
  }

  @Get()
  async findOne(@Req() req) {
    const userId = req.user.sub;
    return await lastValueFrom(
      this.cartClient.send({ cmd: 'cart_get' }, userId),
    );
  }

  @Patch()
  async update(@Body() updateCartDto: UpdateCartDto) {
    return await lastValueFrom(
      this.cartClient.send({ cmd: 'cart_update' }, updateCartDto),
    );
  }
}
