import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { STATUS } from '@v3-nest-full-stack/shared-types';
import { Request } from 'express';
import { UsersService } from 'src/apis/users/users.service';

@Injectable()
export class UserStatusGuard implements CanActivate {
  @Inject(UsersService) private readonly usersService: UsersService;
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const user = request.user;
    // 说明是不需要进行登录的接口
    // 因为login guard没有将用户信息挂上去
    if (!user) {
      return true;
    }
    const userInfo = await this.usersService.findOneById(user.uuid);
    if (!userInfo || userInfo.status === STATUS.DISABLE) {
      throw new UnauthorizedException('用户已被禁用');
    }
    return true;
  }
}
