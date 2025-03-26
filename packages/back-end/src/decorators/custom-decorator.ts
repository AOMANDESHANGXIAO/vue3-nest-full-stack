import { SetMetadata } from '@nestjs/common';
import { REQUIRE_PERMISSIONS_KEY, REQUIRE_LOGIN_KEY } from '../constants';

// 需要登录装饰器，修饰controller或者单个方法都可以
export const RequireLogin = () => SetMetadata(REQUIRE_LOGIN_KEY, true);
// 需要权限装饰器，修饰单个方法
export const RequirePermission = (permission: string) =>
  SetMetadata(REQUIRE_PERMISSIONS_KEY, permission);
// 公开装饰器，修饰单个方法
export const isPublic = () => SetMetadata(REQUIRE_LOGIN_KEY, false);
