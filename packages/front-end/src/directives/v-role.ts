import { useUserStore } from "@/stores/modules/use-user-store";
import type { Directive, DirectiveBinding } from "vue";

export const vRole: Directive = (
  el: HTMLElement,
  binding: DirectiveBinding<string[]>
) => {
  const { value } = binding;
  const { user } = useUserStore();
  if (!value) {
    throw new Error("v-role Error: v-role 需要传入一个字符串数组");
  }
  if (!user) {
    throw new Error("v-role Error: user is not found");
  }
  const hasRole = user.roles.some((role) => value.includes(role));
  if (!hasRole) {
    el.remove();
  }
};
