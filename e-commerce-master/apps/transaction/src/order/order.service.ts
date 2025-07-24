import { OrderItemEntity } from '@app/shared/common/databases/entities/order/order-item.entity';
import { OrderEntity } from '@app/shared/common/databases/entities/order/order.entity';
import { CreateOrderDto } from '@app/shared/dtos/transaction/order/create-order.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,

    @InjectRepository(OrderItemEntity)
    private readonly orderItemRepository: Repository<OrderItemEntity>,
  ) {}

  async create(payload: CreateOrderDto) {
    const { userId, items, shippingInfo, totalAmount, paymentMethod } = payload;

    const order = this.orderRepository.create({
      userId,
      shippingInfo,
      totalAmount,
      paymentMethod,
      status: 'pending', // default
      paymentStatus: 'unpaid', // default
      items: items.map((item) =>
        this.orderItemRepository.create({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          selectedVariants: item.selectedVariants,
        }),
      ),
    });

    return await this.orderRepository.save(order);
  }
  async findAllPaginated(payload: { page: number; limit: number; query: any }) {
    const { page, limit, query } = payload;
    const where = await this.formatFilter(query);
    const [data, count] = await this.orderRepository.findAndCount({
      where,
      take: limit,

      skip: (page - 1) * limit,
      // order: { createdAt: sort },
    });
    return { data, count };
  }

  private formatFilter(query: any): FindOptionsWhere<OrderEntity> {
    const where: FindOptionsWhere<OrderEntity> = {};
    where.deleted = false;

    // Process `label` if present
    if (query.searchTerm && query.searchTerm !== '') {
      // Case-insensitive exact match for `label`
      where.id = ILike(`%${query.searchTerm}%`);
    }

    return where;
  }
}
