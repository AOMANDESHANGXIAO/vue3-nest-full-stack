export const enum RoleEnum {
  User = 'user',
  Admin = 'admin',
  SuperAdmin = 'super-admin',
}

export const enum PermissionEnum {
  // 普通用户的权限
  UserBusiness = 'user-business',
  // 管理员的权限，一般来说，管理员可以对普通用户进行管理
  ManageAdd = 'manage-add',
  ManageDelete = 'manage-delete',
  ManageUpdate = 'manage-update',
  ManageQuery = 'manage-query',
  ManageImport = 'manage-import',
  ManageExport = 'manage-export',
  // 对管理员的管理
  AdminAdd = 'admin-add',
  AdminDelete = 'admin-delete',
  AdminUpdate = 'admin-update',
  AdminQuery = 'admin-query',
}
