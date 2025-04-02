export interface CreateUserDtoInterface {
  username: string;
  password: string;
  nickname: string;
}

export interface FindOneUserApiResult {
  user: {
    id: string;
    status: boolean;
    username: string;
    nickname: string;
    createTime: Date;
    updateTime: Date;
  };
}