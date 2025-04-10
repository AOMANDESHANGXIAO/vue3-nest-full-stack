import service from "@/apis";
import type {
  QueryPermissionDtoType,
  QueryPermissionResult,
} from "@v3-nest-full-stack/shared-types";
import { Base64 } from "js-base64";
const baseUrl = "/permission";

export class PermissionApi {
  static async getList(
    data: QueryPermissionDtoType
  ): Promise<QueryPermissionResult> {
    console.log("PermissionApi.getList data=>", data);
    return service({
      method: "get",
      url: `${baseUrl}/${Base64.encodeURI(JSON.stringify(data))}`,
    });
  }
}
