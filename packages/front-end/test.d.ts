import { DirectiveBinding } from "vue";

export {};

declare module "vue" {
  export interface ComponentCustomProperties {
    vPermissions: DirectiveBinding<string[]>;
    vRole: DirectiveBinding<string[]>;
  }
}
