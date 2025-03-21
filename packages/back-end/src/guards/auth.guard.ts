import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  SetMetadata,
} from '@nestjs/common';
import type { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants, IS_PUBLIC_KEY } from '../constants';
import { Request } from 'express';
import { config } from 'src/config';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 获取请求的元信息
    // ...
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    console.log('method', method);

    // 获取匹配的路由信息
    const handler = context.getHandler(); // 获取路由处理函数
    const controller = context.getClass(); // 获取控制器类
    const routePath = Reflect.getMetadata('path', handler); // 获取路由路径
    const controllerPath = Reflect.getMetadata('path', controller); // 获取控制器路径
    // 这样能获取到匹配的路由路径，可以请求数据库，并进行身份的验证...
    const fullRoutePath = `${config.globalPrefix}/${controllerPath}/${routePath}`; // 完整路由路径
    // 控制器路径/路由路径
    console.log('匹配的路由路径:', fullRoutePath);

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      // 💡 See this condition
      return true;
    }
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    return request.headers.authorization;
  }
}
