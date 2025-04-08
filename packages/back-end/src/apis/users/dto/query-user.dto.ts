export class QueryUserDto {
  pageSize: number;
  current: number;
  username?: string;
  nickname?: string;
  status?: number;
  roleIds?: string[];
}
