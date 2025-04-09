import service from '@/apis'
import type {
  CreateUserDtoInterface,
  AdminAddUserDtoInterface,
  FindOneUserApiResult,
  FindAllUsersApiResult,
  UpdateUserDtoInterface,
  GetAllUsersDtoInterface
} from '@v3-nest-full-stack/shared-types'
import * as Base64 from 'js-base64'
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
    params: GetAllUsersDtoInterface,
  ): Promise<FindAllUsersApiResult> {
    return service({
      method: 'get',
      url: `${baseUrl}/all/${Base64.encode(JSON.stringify(params))}`,
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
