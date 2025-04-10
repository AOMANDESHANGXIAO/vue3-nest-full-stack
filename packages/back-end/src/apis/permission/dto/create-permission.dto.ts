import type { CreatePermissionDtoType } from '@v3-nest-full-stack/shared-types';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreatePermissionDto implements CreatePermissionDtoType {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  desc: string;
}
