import { SetMetadata } from '@nestjs/common';
import {
  IS_PUBLIC_KEY,
  REQUIRE_PERMISSIONS_KEY,
  REQUIRE_LOGIN_KEY,
} from '../constants';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
export const RequireLogin = () => SetMetadata(REQUIRE_LOGIN_KEY, true);
export const RequirePermission = (permission: string) =>
  SetMetadata(REQUIRE_PERMISSIONS_KEY, permission);
