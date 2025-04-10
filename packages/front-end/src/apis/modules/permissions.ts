import service from "@/apis";
import type {
  QueryPermissionDtoType,
  QueryPermissionResult,
  UpdatePermissionDtoType,
} from "@v3-nest-full-stack/shared-types";
import { Base64 } from "js-base64";
import type { CreatePermissionDtoType } from "@v3-nest-full-stack/shared-types";
const baseUrl = "/permission";

export class PermissionApi {
  static async getList(
    data: QueryPermissionDtoType
  ): Promise<QueryPermissionResult> {
    return service({
      method: "get",
      url: `${baseUrl}/${Base64.encodeURI(JSON.stringify(data))}`,
    });
  }
  static async create(data: CreatePermissionDtoType) {
    return service({
      method: "post",
      url: `${baseUrl}`,
      data,
    });
  }
  static async update(id: string, data: UpdatePermissionDtoType) {
    return service({
      method: "patch",
      url: `${baseUrl}/${id}`,
      data,
    });
  }
  static async delete(id: string) {
    return service({
      method: "delete",
      url: `${baseUrl}/${id}`,
    });
  }
}
