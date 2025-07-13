import service from "@/apis";
import type {
  DictListResult,
  QueryParams,
  FindOneDictResult,
  GetAllDictsDetailResult,
} from "@v3-nest-full-stack/shared-types";

const baseUrl = "/dicts";
export class DictsApi {
  static async getDictList(
    params: QueryParams
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
