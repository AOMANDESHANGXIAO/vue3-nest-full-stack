import type { QueryParams, QueryResult } from "./api";

export type QueryPermissionDtoType = QueryParams<{
  name?: string;
  status?: number;
}>;
export type QueryPermissionResult = QueryResult<{
  id: string;
  name: string;
  status: number;
  desc: string;
  createTime: Date;
  updateTime: Date;
  createBy: {
    id: string;
    status: number;
    nickname: string;
    username: string;
    createBy: string | null;
    updateBy: string | null;
    createTime: Date;
    updateTime: Date;
  };
  updateBy: {
    id: string;
    status: number;
    nickname: string;
    username: string;
    createBy: string | null;
    updateBy: string | null;
    createTime: Date;
    updateTime: Date;
  };
}>;
