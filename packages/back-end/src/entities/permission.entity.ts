import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Role } from './role.entity';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 20,
    unique: true, // 唯一约束
  })
  name: string; // 权限名称

  @Column({
    length: 50, // 权限描述
  })
  desc: string;

  @Column({
    default: 1, // 状态 1: 启用 0: 禁用
    type: 'tinyint',
  })
  status: number;

  @ManyToMany(() => Role)
  haveBy: Role[];

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;

  @ManyToOne(() => User) // 创建人
  createBy: User; // 创建人

  @ManyToOne(() => User) // 更新人
  updateBy: User;
}
