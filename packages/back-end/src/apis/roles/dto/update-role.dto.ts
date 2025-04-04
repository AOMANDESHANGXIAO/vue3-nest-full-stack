import { PartialType } from '@nestjs/mapped-types';
import { UpdateRoleInterface } from '@v3-nest-full-stack/shared-types';
import { CreateRoleDto } from './create-role.dto';

export class UpdateRoleDto
  extends PartialType(CreateRoleDto)
  implements Partial<UpdateRoleInterface> {}
