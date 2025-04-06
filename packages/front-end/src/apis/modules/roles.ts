import service from '@/apis'
import {
  type GetRoleListResult,
  type CreateRoleInterface,
} from '@v3-nest-full-stack/shared-types'
import { type UpdateRoleInterface } from '@v3-nest-full-stack/shared-types'

const baseUrl = '/roles'

export class RolesApi {
  static async getRoles(params: {
    current: number
    pageSize: number
    keyWord?: string
  }): Promise<GetRoleListResult> {
    return service({
      method: 'get',
      url: `${baseUrl}`,
      params,
    })
  }
  static async createRole(data: CreateRoleInterface) {
    return service({
      method: 'post',
      url: `${baseUrl}`,
      data,
    })
  }
  static async updateRole(id: string,data: UpdateRoleInterface) {
    return service({
      method: 'patch',
      url: `${baseUrl}/${id}`,
      data,
    })
  }
  static async deleteRole(id: string) {
    return service({
      method: 'delete',
      url: `${baseUrl}/${id}`,
    })
  }
}
