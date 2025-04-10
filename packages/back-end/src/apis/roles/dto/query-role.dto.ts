import type { QueryRolesParams } from '@v3-nest-full-stack/shared-types';
import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsNumber,
  ValidateNested,
} from 'class-validator';
class QueryRoleConditions {
  @IsOptional()
  @IsString()
  name?: string;
}

export class QueryRoleDto implements QueryRolesParams {
  @IsNumber()
  current: number;

  @IsNumber()
  pageSize: number;

  @ValidateNested()
  @Type(() => QueryRoleConditions)
  conditions: QueryRoleConditions;
}
