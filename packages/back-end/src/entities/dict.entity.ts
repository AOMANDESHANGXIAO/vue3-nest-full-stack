import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { DictDetail } from './dict_detail.entity';

@Entity()
export class Dict {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 50,
    unique: true, // 唯一约束
  })
  code: string; // 编码

  @Column({
    length: 50,
  })
  name: string; // 名称

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  desc: string; // 描述

  @Column({
    type: 'tinyint',
    default: 1,
    comment: '状态。1.启用, 0.禁用',
  })
  status: number; // 启用状态

  @OneToMany(() => DictDetail, (detail) => detail.dict_code)
  details: DictDetail[]; // 关联的详情

  @CreateDateColumn()
  createTime: Date; // 创建时间

  @UpdateDateColumn()
  updateTime: Date; // 更新时间

  @ManyToOne(() => User) // 创建人
  createBy: User; // 创建人

  @ManyToOne(() => User) // 更新人
  updateBy: User;
}
