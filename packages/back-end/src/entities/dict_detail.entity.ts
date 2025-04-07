import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { Dict } from './dict.entity';

@Entity()
export class DictDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Dict, (dict) => dict.details) // 关联到 Dict 实体的 details 属性
  dict_code: Dict; // pk

  @Column({ length: 50, type: 'varchar' })
  code: string;

  @Column({ length: 50, type: 'varchar' })
  name: string; // value
}
