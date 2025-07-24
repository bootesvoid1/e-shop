import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { CartEntity } from './cart.entity';

@Entity('cart_items')
export class CartItemEntity extends BaseEntity {
  @ManyToOne(() => CartEntity, (cart) => cart.items, { onDelete: 'CASCADE' })
  cart: CartEntity;

  @Column()
  productId: string; // Reference to product in Product Microservice

  @Column()
  quantity: number;

  @Column()
  price: number; // snapshot of price at time of adding

  @Column('simple-json')
  selectedVariants: Record<string, string>; // e.g. { "color": "red", "size": "M" }
}
