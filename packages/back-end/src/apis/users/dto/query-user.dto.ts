import type { GetAllUsersQueryParams } from '@v3-nest-full-stack/shared-types';

export class QueryUserDto implements GetAllUsersQueryParams {
  pageSize: number;
  current: number;
  consitions?: {
    username?: string;
    nickname?: string;
    status?: number;
    roleIds?: string[];
  };
}
