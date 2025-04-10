import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { Permission } from './permission.entity';
import { User } from './user.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Unique(['name'])
  @Column({
    length: 20,
  })
  name: string;

  @Column({
    length: 100,
  })
  desc: string;

  @Column({
    default: 1,
    type: 'tinyint',
    comment: '0:禁用 1:启用',
  })
  status: number;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;

  @ManyToOne(() => User)
  @JoinTable({
    name: 'created_by_id',
  })
  createdBy: User;

  @ManyToOne(() => User)
  @JoinTable({
    name: 'updated_by_id',
  })
  updatedBy: User;

  @ManyToMany(() => Permission)
  @JoinTable({
    name: 'role_permission_relation',
  })
  permissions: Permission[];
}
