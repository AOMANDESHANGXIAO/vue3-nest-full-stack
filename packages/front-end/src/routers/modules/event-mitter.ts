import { HttpStatus } from "@v3-nest-full-stack/shared-types";
import mitt from "mitt";
import type { Router } from "vue-router";

type Events = {
  [key: string]: Router;
};
const routerMitter = mitt<Events>();

routerMitter.on(HttpStatus.UNAUTHORIZED.toString(), async (router: Router) => {
  console.log("unauthorized 已被处理");
  await router.push("/auth/login");
});

routerMitter.on(HttpStatus.FORBIDDEN.toString(), async (router: Router) => {
  console.log("forbidden 已被处理");
  await router.push("/auth/403");
});

export default routerMitter;
