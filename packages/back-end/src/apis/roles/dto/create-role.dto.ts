import { CreateRoleInterface } from '@v3-nest-full-stack/shared-types';
import { IsString, IsNotEmpty, MaxLength, IsArray } from 'class-validator';

export class CreateRoleDto implements CreateRoleInterface {
  @IsNotEmpty()
  @MaxLength(20)
  @IsString()
  name: string;

  @IsNotEmpty()
  @MaxLength(100)
  @IsString()
  desc: string;

  @IsArray()
  @IsString({ each: true })
  permissionIds: string[];
}
