import { useUserStore } from "@/stores/modules/use-user-store";
import type { Directive, DirectiveBinding } from "vue";

const hasPermissionChche = new Map<string, boolean>();

const isUserHasPermission = (onePermission: string) => {
  const { user } = useUserStore();
  if (!user) {
    throw new Error("v-permissions Error: user is not found");
  }
  if (hasPermissionChche.get(onePermission)) {
    return hasPermissionChche.get(onePermission);
  }
  const isHasPermission = user.permissions.some((permission) =>
    onePermission.includes(permission)
  );
  hasPermissionChche.set(onePermission, isHasPermission);
  return isHasPermission;
};

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
