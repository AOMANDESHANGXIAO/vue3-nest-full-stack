import service from "@/apis";
import { type GetRoleListResult } from "@v3-nest-full-stack/shared-types";

const baseUrl = "/roles";

export class RolesApi {
  static async getRoles(params: {
    page: number;
    size: number;
  }): Promise<GetRoleListResult> {
    return service({
      method: "get",
      url: `${baseUrl}`,
      params,
    });
  }
}
