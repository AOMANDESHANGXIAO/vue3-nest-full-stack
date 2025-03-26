import service from '@/apis'
import { type CreateUserDtoInterface } from '@v3-nest-full-stack/shared-types'

const baseUrl = '/users'

export class UserApi {
  static async getUserInfo(): Promise<{
    username: string
    avatarUrl: string
  }> {
    return service({
      method: 'get',
      url: `${baseUrl}/info`,
    })
  }
  static async login(data: { username: string; password: string }): Promise<{
    token: string
  }> {
    return service({
      method: 'post',
      url: `${baseUrl}/login`,
      data,
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
