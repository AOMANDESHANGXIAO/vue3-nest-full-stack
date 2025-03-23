import { SetMetadata } from '@nestjs/common';
import { REQUIRE_PERMISSIONS_KEY, REQUIRE_LOGIN_KEY } from '../constants';

export const RequireLogin = () => SetMetadata(REQUIRE_LOGIN_KEY, true);

export const RequirePermission = (permission: string) =>
  SetMetadata(REQUIRE_PERMISSIONS_KEY, permission);
