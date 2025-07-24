import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { SpecificationGroupEntity } from './specifications-group.entity';

@Entity('specifications')
export class SpecificationEntity extends BaseEntity {
  @Column()
  label: string; // e.g. "Brand"

  @Column()
  value: string; // e.g. "Apple"

  @ManyToOne(() => SpecificationGroupEntity, (group) => group.specifications, {
    onDelete: 'CASCADE',
  })
  group: SpecificationGroupEntity;
}
