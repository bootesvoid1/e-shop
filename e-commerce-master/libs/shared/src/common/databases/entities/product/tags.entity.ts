import { Column, Entity, ManyToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { ProductsEntity } from './product.entity';

@Entity('tags')
export class TagsEntity extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;
  @ManyToMany(() => ProductsEntity, (product) => product.tags)
  products: ProductsEntity[];
}
