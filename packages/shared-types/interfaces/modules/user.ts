export interface CreateUserDtoInterface {
  username: string;
  password: string;
  nickname: string;
}
/**
 * @deprecated
 */
export interface GetAllUsersDtoInterface {
  pageSize: number;
  current: number;
  conditions?: {
    username?: string;
    nickname?: string;
    status?: number;
    roleIds?: string[];
  };
}

export interface AdminAddUserDtoInterface extends CreateUserDtoInterface {
  roleIds?: string[];
}
export interface UpdateUserDtoInterface
  extends Partial<CreateUserDtoInterface> {
  status?: number;
  roleIds?: string[];
}
export interface FindOneUserApiResult {
  user: {
    id: string;
    status: number;
    username: string;
    nickname: string;
    createTime: Date;
    updateTime: Date;
  };
}
export interface UserResponse {
  id: string;
  status: number;
  nickname: string;
  username: string;
  createTime: Date;
  updateTime: Date;
  roles: any[]; // 如果roles有具体结构，可以进一步定义
}
export interface FindAllUsersApiResult {
  list: UserResponse[];
  total: number;
}
