export interface CreateRoleInterface {
  name: string;
  desc: string;
}

export interface GetRoleListResult {
  list: {
    id: string;
    name: string;
    desc: string;
    status: boolean;
    createTime: Date;
    updateTime: Date;
    createdBy: {
      id: string;
      status: boolean;
      nickname: string;
      username: string;
      createTime: Date;
      updateTime: Date;
    };
    updatedBy: {
      id: string;
      status: boolean;
      nickname: string;
      username: string;
      createTime: Date;
      updateTime: Date;
    };
  }[];
  total: number;
}
