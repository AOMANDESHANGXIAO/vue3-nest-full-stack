import service from '@/apis'
import { type LoginDtoInterface, type LoginApiResult } from '@v3-nest-full-stack/shared-types';
const baseUrl = '/auth'

export class AuthApi {
  static async login(data: LoginDtoInterface): Promise<LoginApiResult> {
    return service({
      method: 'post',
      url: `${baseUrl}/login`,
      data,
    })
  }
}
