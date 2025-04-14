import { useUserStore } from "@/stores/modules/use-user-store";
import type { Directive, DirectiveBinding } from "vue";
export const vPermissions: Directive = (
  el: HTMLElement,
  binding: DirectiveBinding<string[]>
) => {
  const { value } = binding;
  const { user } = useUserStore();
  if (!value) {
    throw new Error("v-permissions Error: v-permissions 需要传入一个字符串数组");
  }
  if (!user) {
    throw new Error("v-permissions Error: user is not found");
  }
  const hasPermission = user.permissions.some((permission) =>
    value.includes(permission)
  );
  if (!hasPermission) {
    el.remove();
  }
};
