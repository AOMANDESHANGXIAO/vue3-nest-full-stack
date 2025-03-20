/**
 * 接口返回类型定义
 */
export type Response<T> = {
  code: number
  message: string
  success: boolean
  timestamp: string
  data: T
}