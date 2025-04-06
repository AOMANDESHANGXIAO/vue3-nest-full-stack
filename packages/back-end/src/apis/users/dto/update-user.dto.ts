import { IsArray, IsBoolean } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDtoInterface } from '@v3-nest-full-stack/shared-types';
export class UpdateUserDto
  extends PartialType(CreateUserDto)
  implements UpdateUserDtoInterface
{
  @IsBoolean()
  status?: boolean;

  @IsArray()
  roleIds?: string[];
}
