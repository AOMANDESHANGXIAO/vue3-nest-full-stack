import service from '../index'
const baseUrl = '/teacher'

export class TeacherApi {
  static async getTeacherInfo(params: {
    page: number
    pageSize: number
  }): Promise<{
    list: {
      id: number
      name: string
      age: number
      department: string
      status: number
      createdTime: string
    }[]
    total: number
  }> {
    return service({
      method: 'get',
      url: `${baseUrl}/list`,
      params,
    })
  }
}
