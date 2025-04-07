import service from "@/apis";
import type {
  DictListResult,
  GetListCommonParams,
} from "@v3-nest-full-stack/shared-types";

const baseUrl = "/dicts";
export class DictsApi {
  static async getDictList(params: GetListCommonParams): Promise<DictListResult> {
    return service({
      method: "get",
      url: `${baseUrl}`,
      params,
    });
  }
}
