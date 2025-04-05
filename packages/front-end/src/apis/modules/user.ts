import service from '@/apis'
import type {
  CreateUserDtoInterface,
  FindOneUserApiResult,
  FindAllUsersApiResult,
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
  static async getAllUsers(params: {
    pageSize: number
    current: number
  }): Promise<FindAllUsersApiResult> {
    return service({
      method: 'get',
      url: `${baseUrl}/all`,
      params,
    })
  }
}
