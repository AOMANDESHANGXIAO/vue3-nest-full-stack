import service from '@/apis'
import type {
  CreateUserDtoInterface,
  AdminAddUserDtoInterface,
  FindOneUserApiResult,
  FindAllUsersApiResult,
  UpdateUserDtoInterface,
} from '@v3-nest-full-stack/shared-types'

const baseUrl = '/users'

export class UserApi {
  static async getUserInfo(): Promise<FindOneUserApiResult> {
    return service({
      method: 'get',
      url: `${baseUrl}`,
    })
  }
  static async register(data: CreateUserDtoInterface): Promise<any> {
    return service({
      method: 'post',
      url: `${baseUrl}`,
      data,
    })
  }
  static async getAllUsers(
    params: {
      pageSize: number
      current: number
    },
    queryKeyWord?: {
      username?: string
      nickname?: string
      status?: number
      roleIds?: string[]
    }
  ): Promise<FindAllUsersApiResult> {
    if (queryKeyWord) {
      params = { ...params, ...queryKeyWord }
    }
    return service({
      method: 'get',
      url: `${baseUrl}/all`,
      params: {
        query: JSON.stringify(params),
      },
    })
  }
  static async addUser(data: AdminAddUserDtoInterface): Promise<any> {
    return service({
      method: 'post',
      url: `${baseUrl}/add`,
      data,
    })
  }
  static async updateUser(
    id: string,
    data: UpdateUserDtoInterface
  ): Promise<any> {
    return service({
      method: 'patch',
      url: `${baseUrl}/${id}`,
      data,
    })
  }
}
