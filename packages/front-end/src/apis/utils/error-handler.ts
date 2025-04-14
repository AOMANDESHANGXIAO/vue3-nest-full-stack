import router from "@/routers";
import routerMitter from "@/routers/modules/event-mitter";
import { HttpStatus } from "@v3-nest-full-stack/shared-types";
import { userStoreMitter } from "@/stores/modules/use-user-store";

function handleErrorByCode(code: number) {
  if (code === HttpStatus.UNAUTHORIZED) {
    userStoreMitter.emit(HttpStatus.UNAUTHORIZED.toString());
    routerMitter.emit(HttpStatus.UNAUTHORIZED.toString(), router);
  }
  if (code === HttpStatus.FORBIDDEN) {
    routerMitter.emit(HttpStatus.FORBIDDEN.toString(), router);
  }
}

export default handleErrorByCode;
