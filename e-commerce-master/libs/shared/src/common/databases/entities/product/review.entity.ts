import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ProductsEntity } from './product.entity';
import { BaseEntity } from '../base.entity';

@Entity('reviews')
export class ReviewsEntity extends BaseEntity {
  @Column({})
  rating: number;

  @Column({ nullable: true })
  comment: string;

  // @ManyToOne(() => ProductsEntity, (product) => product.reviews)
  // @JoinColumn({ name: 'prodcut_id' })
  // product: ProductsEntity;

  userId: string;
}
