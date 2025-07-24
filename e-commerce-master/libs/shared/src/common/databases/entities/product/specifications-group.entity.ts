import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { ProductsEntity } from './product.entity';
import { SpecificationEntity } from './specifications.entity';

@Entity('specification_groups')
export class SpecificationGroupEntity extends BaseEntity {
  @Column()
  name: string; // e.g. "General", "Display"

  @ManyToOne(() => ProductsEntity, (product) => product.specificationGroups, {
    onDelete: 'CASCADE',
  })
  product: ProductsEntity;

  @OneToMany(() => SpecificationEntity, (spec) => spec.group, {
    cascade: true,
    eager: true,
  })
  specifications: SpecificationEntity[];
}
