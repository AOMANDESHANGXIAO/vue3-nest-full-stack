import { RoleEnum } from '@v3-nest-full-stack/shared-types';
import { PermissionEnum } from '@v3-nest-full-stack/shared-types';
export type RoleTypeItem = {
  name: RoleEnum;
  permissions: PermissionEnum[];
};

const roles: RoleTypeItem[] = [
  {
    name: RoleEnum.User,
    permissions: [PermissionEnum.UserBusiness],
  },
  {
    name: RoleEnum.Admin,
    permissions: [
      PermissionEnum.UserBusiness,
      PermissionEnum.ManageAdd,
      PermissionEnum.ManageUpdate,
      PermissionEnum.ManageQuery,
      PermissionEnum.ManageImport,
      PermissionEnum.ManageExport,
    ],
  },
  {
    name: RoleEnum.SuperAdmin,
    permissions: [
      PermissionEnum.UserBusiness,
      PermissionEnum.ManageQuery,
      PermissionEnum.ManageAdd,
      PermissionEnum.ManageUpdate,
      PermissionEnum.ManageDelete,
      PermissionEnum.ManageImport,
      PermissionEnum.ManageExport,
      PermissionEnum.AdminAdd,
      PermissionEnum.AdminDelete,
      PermissionEnum.AdminUpdate,
      PermissionEnum.AdminQuery,
    ],
  },
];
const permissions: { name: PermissionEnum; dec: string }[] = [
  {
    name: PermissionEnum.UserBusiness,
    dec: '用户业务权限',
  },
  {
    name: PermissionEnum.ManageAdd,
    dec: '管理添加权限',
  },
  {
    name: PermissionEnum.ManageDelete,
    dec: '管理删除权限',
  },
  {
    name: PermissionEnum.ManageUpdate,
    dec: '管理更新权限',
  },
  {
    name: PermissionEnum.ManageQuery,
    dec: '管理查询权限',
  },
  {
    name: PermissionEnum.ManageImport,
    dec: '管理导入权限',
  },
  {
    name: PermissionEnum.ManageExport,
    dec: '管理导出权限',
  },
  {
    name: PermissionEnum.AdminAdd,
    dec: '管理员添加权限',
  },
  {
    name: PermissionEnum.AdminDelete,
    dec: '管理员删除权限',
  },
  {
    name: PermissionEnum.AdminUpdate,
    dec: '管理员更新权限',
  },
  {
    name: PermissionEnum.AdminQuery,
    dec: '管理员查询权限',
  },
];
export const config = {
  // 全局前缀
  globalPrefix: '/api',
  // 角色设置
  roles,
  // 权限设置
  permissions,
};
