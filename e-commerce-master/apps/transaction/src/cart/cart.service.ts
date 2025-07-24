import { CartEntity } from '@app/shared/common/databases/entities/cart/cart.entity';
import { CartItemEntity } from '@app/shared/common/databases/entities/cart/cart_items.entity';
import { CreateCartDto } from '@app/shared/dtos/cart/create-cart.dto';
import { UpdateCartDto } from '@app/shared/dtos/cart/update-cart.dto';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom } from 'rxjs';
import { Repository } from 'typeorm';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,

    @InjectRepository(CartItemEntity)
    private readonly cartItemsRepository: Repository<CartItemEntity>,

    @Inject('PRODUCT_SERVICE')
    private readonly productClient: ClientProxy,
  ) {}

  async create(payload: CreateCartDto) {
    const { userId, items } = payload;

    const existing = await this.cartRepository.findOne({
      where: { userId },
      relations: ['items'],
    });

    if (existing) {
      // Either return existing, or update it, or throw
      return existing;
    }

    const cart = this.cartRepository.create({
      userId,
      items: items.map((item) =>
        this.cartItemsRepository.create({
          productId: item.productId.toString(),
          quantity: item.quantity,
          price: item.price,
          selectedVariants: item.selectedVariants,
        }),
      ),
    });

    return this.cartRepository.save(cart);
  }

  async findOne(userId: string) {
    const cart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['items'],
    });

    if (!cart) {
      throw new Error(`Cart not found for user ID ${userId}`);
    }

    // Fetch product details in parallel
    const enrichedItems = await Promise.all(
      cart.items.map(async (item) => {
        const product = await lastValueFrom(
          this.productClient.send({ cmd: 'product_find_one' }, item.productId),
        );

        return {
          ...item,
          product,
        };
      }),
    );

    return {
      ...cart,
      items: enrichedItems,
    };
  }
  async update(payload: UpdateCartDto) {
    const { userId, items } = payload;

    const cart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['items'],
    });

    if (!cart) {
      throw new Error(`Cart not found for user ID ${userId}`);
    }

    // Remove all old items
    await this.cartItemsRepository.remove(cart.items);

    // Add new items

    if (items?.length) {
      const newItems = items.map((item) =>
        this.cartItemsRepository.create({
          productId: item.productId.toString(),
          quantity: item.quantity,
          price: item.price,
          selectedVariants: item.selectedVariants,
        }),
      );

      cart.items = newItems;
    }

    return await this.cartRepository.save(cart);
  }
}
