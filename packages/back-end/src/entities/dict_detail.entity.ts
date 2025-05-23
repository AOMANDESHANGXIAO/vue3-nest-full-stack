import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Dict } from './dict.entity';

@Entity()
export class DictDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Dict, (dict) => dict.details) // 关联到 Dict 实体的 details 属性
  dict_code: Dict; // pk

  @Column({
    type: 'tinyint',
    comment: '编码示范,0,1,2',
  })
  code: number;

  @Column({ length: 50, type: 'varchar' })
  name: string; // value

  @Column({
    type: 'tinyint',
    default: 1,
    comment: '0:禁用 1:启用',
  })
  status: number;
}
