import service from '@/apis'
import type {
  GetRoleListResult,
  CreateRoleInterface,
  GetAllRolesResult,
} from '@v3-nest-full-stack/shared-types'
import {
  type UpdateRoleInterface,
  type QueryRolesParams,
} from '@v3-nest-full-stack/shared-types'
import { Base64 } from 'js-base64'

const baseUrl = '/roles'

export class RolesApi {
  static async getRoles(params: QueryRolesParams): Promise<GetRoleListResult> {
    return service({
      method: 'get',
      url: `${baseUrl}/page/${Base64.encode(JSON.stringify(params))}`,
    })
  }
  static async getAllRoles(params?: {
    keyWord?: string
  }): Promise<GetAllRolesResult> {
    return service({
      method: 'get',
      url: `${baseUrl}/all`,
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
  static async updateRole(id: string, data: UpdateRoleInterface) {
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
