import service from '@/apis'

const baseUrl = '/user'

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
}
