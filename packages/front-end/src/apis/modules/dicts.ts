import service from "@/apis";
import type {
  DictListResult,
  GetListCommonParams,
  FindOneDictResult,
  GetAllDictsDetailResult,
} from "@v3-nest-full-stack/shared-types";

const baseUrl = "/dicts";
export class DictsApi {
  static async getDictList(
    params: GetListCommonParams
  ): Promise<DictListResult> {
    return service({
      method: "get",
      url: `${baseUrl}`,
      params,
    });
  }

  static async getSelectableDictList(code: string): Promise<FindOneDictResult> {
    return service({
      method: "get",
      url: `${baseUrl}/${code}`,
    });
  }

  static getAlllDictsDetails(): Promise<GetAllDictsDetailResult> {
    return service({
      method: "get",
      url: `${baseUrl}/all/details`,
    });
  }
}
