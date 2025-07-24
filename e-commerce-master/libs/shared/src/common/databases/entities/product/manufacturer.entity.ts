import { Column, Entity, OneToMany } from 'typeorm';
import { ProductsEntity } from './product.entity';
import { BaseEntity } from '../base.entity';

@Entity('manufacturers')
export class ManufacturersEntity extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  details: string;

  //   Relations

  @OneToMany(() => ProductsEntity, (product) => product.manufacturer)
  products: ProductsEntity[];
}
