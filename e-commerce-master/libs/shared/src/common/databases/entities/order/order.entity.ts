import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { OrderItemEntity } from './order-item.entity';
@Entity('order')
export class OrderEntity extends BaseEntity {
  @Column()
  userId: string; // or nullable if guest

  @OneToMany(() => OrderItemEntity, (item) => item.order, { cascade: true })
  items: OrderItemEntity[];

  @Column('json')
  shippingInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    city: string;
    ZipCode: string;
    street: string;
    notes?: string;
  };

  @Column()
  totalAmount: number;

  @Column({ default: 'pending' })
  status: 'pending' | 'paid' | 'shipped' | 'cancelled';

  @Column()
  paymentMethod: 'card' | 'paypal' | 'cod';

  @Column({ type: 'varchar', nullable: true })
  paymentStatus: 'paid' | 'unpaid' | null;
}
