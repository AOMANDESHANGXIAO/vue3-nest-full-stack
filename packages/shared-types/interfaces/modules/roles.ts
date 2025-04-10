export interface CreateRoleInterface {
  name: string
  desc: string
  permissionIds?: string[]
}
export interface UpdateRoleInterface extends Partial<CreateRoleInterface> {}
export interface RoleOperatorRecord {
  id: string
  status: number
  nickname: string
  username: string
  createTime: Date
  updateTime: Date
}
export interface GetRoleListResult {
  list: {
    id: string
    name: string
    desc: string
    status: number
    createTime: Date
    updateTime: Date
    createdBy: RoleOperatorRecord
    updatedBy: RoleOperatorRecord
    permissions: any[]
  }[]
  total: number
}
export interface GetAllRolesResult {
  list: {
    id: string
    name: string
    desc: string
    status: number
    createTime: Date
    updateTime: Date
    createdBy: RoleOperatorRecord
    updatedBy: RoleOperatorRecord
  }[]
}
