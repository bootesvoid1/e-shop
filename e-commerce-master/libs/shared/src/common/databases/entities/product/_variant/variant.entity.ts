import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../base.entity';
import { VariantValueEntity } from './variant-value.entity';
import { ProductVariantEntity } from './product-variant.entity';
@Entity('products__variant')
export class VariantEntity extends BaseEntity {
  @Column({ default: '' })
  name: string;

  @Column({ default: '' })
  label: string;

  @OneToMany(() => VariantValueEntity, (value) => value.variant, {
    cascade: true,
  })
  values: VariantValueEntity[];

  @Column({ type: 'enum', enum: ['text', 'color'], default: 'text' })
  type: 'text' | 'color';
  @OneToMany(() => ProductVariantEntity, (products) => products.variant)
  products: ProductVariantEntity[];
}
