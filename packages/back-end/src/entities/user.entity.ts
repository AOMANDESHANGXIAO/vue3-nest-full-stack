import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    default: true,
    comment: '该用户是否可用',
    type: 'boolean',
  })
  status: boolean;

  @Column({
    length: 50,
  })
  nickname: string;

  @Column({
    length: 50,
  })
  username: string;

  @Column({
    length: 50,
    select: false,
  })
  password: string;

  @Column({
    length: 50,
    comment: '创建人',
    nullable: true,
  })
  createBy: string;

  @Column({
    length: 50,
    comment: '更新人',
    nullable: true,
  })
  updateBy: string;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_role_relation',
  })
  roles: Role[];
}
