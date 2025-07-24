import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '../base.entity';
import { CategoryEntity } from './category.entity';
import { FeaturesEntity } from './product-features.entity';
import { ManufacturersEntity } from './manufacturer.entity';
import { TagsEntity } from './tags.entity';
import { DocumentEntity } from '../document.entity';
import { ProductVariantEntity } from './_variant/product-variant.entity';
import { SpecificationGroupEntity } from './specifications-group.entity';

@Entity('products')
export class ProductsEntity extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  displayTitle: string;

  @Column()
  SKU: string;

  @Column({ nullable: true })
  isFeatured: boolean;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column()
  stock: number;

  @Column()
  userId: string;

  @Column()
  discount: number;

  @Column({
    type: 'enum',
    enum: ['active', 'inactive', 'archived'],
    default: 'active',
  })
  status: 'active' | 'inactive' | 'archived';

  // Relations
  // Cart can have one user
  @ManyToOne(() => CategoryEntity, (category) => category.products)
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;

  // @OneToMany(() => ReviewsEntity, (review) => review.product)
  // reviews: ReviewsEntity[];

  @ManyToMany(() => FeaturesEntity, (features) => features.products, {
    nullable: true,
  })
  @JoinTable({
    name: 'product_features',
    joinColumn: {
      name: 'product_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'feature_id',
      referencedColumnName: 'id',
    },
  })
  features: FeaturesEntity[];
  @ManyToOne(
    () => ManufacturersEntity,
    (manufacturer) => manufacturer.products,
    { nullable: true },
  )
  @JoinColumn({ name: 'manufacturer_id' })
  manufacturer: ManufacturersEntity;

  @ManyToMany(() => TagsEntity, (tag) => tag.products, {
    cascade: true,
    eager: true,
  })
  @JoinTable()
  tags: TagsEntity[];

  @OneToMany(() => DocumentEntity, (document) => document.product)
  documents: DocumentEntity[];

  @OneToMany(
    () => ProductVariantEntity,
    (productVariant) => productVariant.product,
  )
  variants: ProductVariantEntity[];

  @OneToMany(() => SpecificationGroupEntity, (group) => group.product, {
    cascade: true,
  })
  specificationGroups: SpecificationGroupEntity[];
}
