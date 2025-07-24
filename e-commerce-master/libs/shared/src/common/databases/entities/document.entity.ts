import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { ProductsEntity } from './product/product.entity';
import { CategoryEntity } from './product/category.entity';
import { BaseEntity } from './base.entity';

@Entity('documents')
export class DocumentEntity extends BaseEntity {
  @Column()
  label: string;

  @Column({ default: '' })
  url: string;

  @ManyToOne(() => ProductsEntity, (product) => product.documents)
  @JoinColumn()
  product: ProductsEntity;

  @OneToOne(() => CategoryEntity, (category) => category.document)
  @JoinColumn()
  category: CategoryEntity;
}
