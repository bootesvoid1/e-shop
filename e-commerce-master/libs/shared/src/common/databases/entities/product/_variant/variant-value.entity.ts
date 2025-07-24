import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../base.entity';
import { VariantEntity } from './variant.entity';

@Entity('products__variant_value')
export class VariantValueEntity extends BaseEntity {
  @Column({ default: '' })
  label: string;

  @ManyToOne(() => VariantEntity, (variant) => variant.values, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  variant: VariantEntity;
}
