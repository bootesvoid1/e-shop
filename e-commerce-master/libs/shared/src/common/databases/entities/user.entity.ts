import { Column, Entity } from 'typeorm';

import { BaseEntity } from './base.entity';

@Entity('users')
export class UsersEntity extends BaseEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  phoneNumber: string;

  @Column({ nullable: true })
  twoFactorSecret: string;

  @Column({ default: false })
  isTwoFactorEnabled: boolean;

  @Column({ nullable: true })
  twoFactorCode: string;

  @Column({ type: 'datetime', nullable: true })
  twoFactorCodeExpiresAt: Date | null;

  @Column({ nullable: true })
  passwordResetToken: string;

  @Column({ type: 'datetime', nullable: true })
  passwordResetTokenExpiresAt: Date | null;

  @Column({ nullable: true })
  address?: string;

  @Column({ type: 'enum', enum: ['admin', 'user'], default: 'user' })
  role: 'admin' | 'user';

  @Column({
    type: 'enum',
    enum: ['actif', 'inactive', 'archived'],
    default: 'actif',
  })
  status: 'actif' | 'inactive' | 'archived';
}
