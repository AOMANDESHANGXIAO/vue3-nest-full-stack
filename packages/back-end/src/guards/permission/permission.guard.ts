import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/apis/users/users.service';
import { Request } from 'express';
import { Permission } from 'src/entities/permission.entity';
import { Reflector } from '@nestjs/core';
import { REQUIRE_PERMISSIONS_KEY } from 'src/constants';

@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject(UsersService) private usersService: UsersService;
  @Inject(Reflector) private reflector: Reflector;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request: Request = context.switchToHttp().getRequest();
      // 说明是不需要进行登录的接口
      // 因为login guard没有将用户信息挂上去
      if (request.user === undefined) {
        return true;
      }
      const requirePermission: string = this.reflector.getAllAndOverride(
        REQUIRE_PERMISSIONS_KEY,
        [context.getHandler(), context.getClass()],
      );
      if (!requirePermission) {
        return true;
      }
      const user = await this.usersService.findRolesById(request.user.uuid);
      const roles = user.roles;
      console.log('permission check user.roles=', user.roles);
     
      const permissions: Permission[] = roles.reduce((total, current) => {
        total.push(...current.permissions);
        return total;
      }, []);
      console.log('permission check permissions=', permissions);
      console.log('permission check requirePermission=', requirePermission);
      const isPermitted = permissions.some(
        (item) => item.name === requirePermission,
      );
      console.log('permission check isPermitted=', isPermitted);
      if (!isPermitted) {
        throw new UnauthorizedException('您没有权限访问该接口');
      }
      return true;
    } catch (e) {
      console.log('permission check error', e);
      return false;
    }
  }
}
