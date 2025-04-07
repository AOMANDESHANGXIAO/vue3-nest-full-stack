import service from '@/apis'
import type {
  DictListResult,
  GetListCommonParams,
  FindOneDictResult,
} from '@v3-nest-full-stack/shared-types'

const baseUrl = '/dicts'
export class DictsApi {
  static async getDictList(
    params: GetListCommonParams
  ): Promise<DictListResult> {
    return service({
      method: 'get',
      url: `${baseUrl}`,
      params,
    })
  }

  static async getDict(code: string): Promise<FindOneDictResult> {
    return service({
      method: 'get',
      url: `${baseUrl}/${code}`,
    })
  }

  static getTransferText(code: string, dictCode: string): Promise<string> {
    return service({
      method: 'get',
      url: `${baseUrl}/transfer/code`,
      params: { code, dictCode },
    })
  }
}
