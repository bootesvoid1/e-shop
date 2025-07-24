import { Column, Entity, ManyToMany } from 'typeorm';
import { ProductsEntity } from './product.entity';
import { BaseEntity } from '../base.entity';

@Entity('features')
export class FeaturesEntity extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  //   Relations
  @ManyToMany(() => ProductsEntity, (product) => product.features, {
    nullable: true,
  })
  products: ProductsEntity[];
}
