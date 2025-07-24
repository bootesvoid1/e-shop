import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../base.entity';
import { ProductsEntity } from '../product.entity';
import { VariantEntity } from './variant.entity';

@Entity('products_product_variant')
export class ProductVariantEntity extends BaseEntity {
  @ManyToOne(() => ProductsEntity, (product) => product.variants)
  product: ProductsEntity;

  @ManyToOne(() => VariantEntity, (variant) => variant.products)
  variant: VariantEntity;

  @Column({ default: '' })
  value: string;
}
