import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { OrderEntity } from './order.entity';
@Entity('order_items')
export class OrderItemEntity extends BaseEntity {
  @ManyToOne(() => OrderEntity, (order) => order.items)
  order: OrderEntity;

  @Column()
  productId: string;

  @Column()
  quantity: number;

  @Column()
  price: number;

  @Column('json')
  selectedVariants: Record<string, string>;
}
