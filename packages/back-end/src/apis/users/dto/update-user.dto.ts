import { IsArray, IsBoolean } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsBoolean()
  status?: boolean;

  @IsArray()
  roleIds?: string[];
}
