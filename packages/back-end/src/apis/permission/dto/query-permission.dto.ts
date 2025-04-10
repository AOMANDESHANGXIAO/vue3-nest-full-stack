import type { QueryPermissionDtoType } from '@v3-nest-full-stack/shared-types';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class QueryPermissionConditions {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  status?: number;
}

export class QueryPermissionDto implements QueryPermissionDtoType {
  @IsNumber()
  current: number;
  @IsNumber()
  pageSize: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => QueryPermissionConditions)
  conditions?: QueryPermissionConditions;
}
