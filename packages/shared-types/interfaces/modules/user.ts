export interface CreateUserDtoInterface {
  username: string
  password: string
  nickname: string
}
export interface AdminAddUserDtoInterface extends CreateUserDtoInterface {
  roleIds?: string[]
}
export interface UpdateUserDtoInterface
  extends Partial<CreateUserDtoInterface> {
  status?: boolean
  roleIds?: string[]
}
export interface FindOneUserApiResult {
  user: {
    id: string
    status: boolean
    username: string
    nickname: string
    createTime: Date
    updateTime: Date
  }
}
export interface UserResponse {
  id: string
  status: boolean
  nickname: string
  username: string
  createTime: Date
  updateTime: Date
  roles: any[] // 如果roles有具体结构，可以进一步定义
}
export interface FindAllUsersApiResult {
  list: UserResponse[]
  total: number
}
