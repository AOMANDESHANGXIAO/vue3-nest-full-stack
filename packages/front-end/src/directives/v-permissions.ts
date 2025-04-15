import { useUserStore, type UserVO } from "@/stores/modules/use-user-store";
import type { Directive, DirectiveBinding } from "vue";

let thisUser: UserVO | null = null;

const userStore = useUserStore();

export const vPermissions: Directive = (
  el: HTMLElement,
  binding: DirectiveBinding<string[] | string>
) => {
  const { value } = binding;
  if (!value) {
    throw new Error(
      `v-permissions Error: v-permissions 需要传入一个字符串数组或字符串。
      示例:v-permissions=\"['user:create', 'user:update']\" 
      或 v-permissions=\"user:create\"`
    );
  }
  thisUser = userStore.user;
  if (!thisUser) {
    throw new Error("v-permissions Error: user is not found");
  }
  const hasPermission = Array.isArray(value)
    ? value.some((permission) => thisUser!.permissions.includes(permission))
    : thisUser!.permissions.includes(value);
  if (!hasPermission) {
    el.remove();
  }
};
