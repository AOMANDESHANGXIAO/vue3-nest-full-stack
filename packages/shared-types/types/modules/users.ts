import type { QueryParams } from './api'

export type GetAllUsersQueryParams = QueryParams<{
  username?: string;
  nickname?: string;
  status?: number;
  roleIds?: string[];
}>