import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { ProductsEntity } from './product.entity';
import { BaseEntity } from '../base.entity';
import { DocumentEntity } from '../document.entity';

@Entity('categories')
export class CategoryEntity extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  slug: string;

  @OneToMany(() => ProductsEntity, (product) => product.category)
  products: ProductsEntity[];
  @OneToOne(() => DocumentEntity, (document) => document.category, {
    cascade: true,
    eager: true,
  })
  document: DocumentEntity;
}
