import service from '@/apis'

const baseUrl = '/auth'

export class AuthApi {
  static async login(data: { username: string; password: string }): Promise<{
    access_token: string
  }> {
    return service({
      method: 'post',
      url: `${baseUrl}/login`,
      data,
    })
  }
}
