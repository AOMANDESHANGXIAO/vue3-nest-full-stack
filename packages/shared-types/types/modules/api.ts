// 此处存放接口的响应定义

/**
 * 接口返回类型定义
 */
export type ApiResponse<T> = {
  code: number;
  message: string;
  success: boolean;
  timestamp: string;
  data: T;
};
export type QueryParams<ConditionType = any> = {
  current: number
  pageSize: number
  conditions?: ConditionType
}
export type GetListCommonParams = {
  current: number;
  pageSize: number;
};
