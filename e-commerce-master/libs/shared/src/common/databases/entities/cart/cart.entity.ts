import { Entity, Column, OneToMany } from 'typeorm';
import { CartItemEntity } from './cart_items.entity';
import { BaseEntity } from '../base.entity';

@Entity('carts')
export class CartEntity extends BaseEntity {
  @OneToMany(() => CartItemEntity, (item) => item.cart, {
    cascade: true,
    eager: true,
  })
  items: CartItemEntity[];

  @Column()
  userId: string;
}
