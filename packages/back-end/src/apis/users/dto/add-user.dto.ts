/**
 * 管理员手动添加用户 DTO
 */
import { AdminAddUserDtoInterface } from '@v3-nest-full-stack/shared-types';
import { CreateUserDto } from './create-user.dto';
import { IsArray } from 'class-validator';

export class AddUserDto
  extends CreateUserDto
  implements AdminAddUserDtoInterface
{
  @IsArray()
  roleIds: string[]; // 角色ID数组
  // 其他属性可以根据需要添加
}
