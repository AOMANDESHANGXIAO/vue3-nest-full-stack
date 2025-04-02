import service from '@/apis'
import { type CreateUserDtoInterface, type FindOneUserApiResult } from '@v3-nest-full-stack/shared-types'

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
}
