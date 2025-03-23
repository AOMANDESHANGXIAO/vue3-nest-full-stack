import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Scope,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants, REQUIRE_LOGIN_KEY } from 'src/constants';
import { Request } from 'express';
import { JWTPayload } from 'src/types';

declare module 'express' {
  interface Request {
    user: JWTPayload;
  }
}

@Injectable({ scope: Scope.DEFAULT })
export class LoginGuard implements CanActivate {
  @Inject(JwtService) private jwtService: JwtService;
  @Inject(Reflector) private reflector: Reflector;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('login-guard check');
    const request = context.switchToHttp().getRequest();

    const isRequiredLogin = this.reflector.getAllAndOverride<boolean>(
      REQUIRE_LOGIN_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!isRequiredLogin) {
      return true;
    }
    const token = this.extractTokenFromHeader(request);
    console.log('login-guard token', token);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload: JWTPayload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload;
    } catch (e) {
      console.log('login-guard error', e);
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    return request.headers.authorization;
  }
}
