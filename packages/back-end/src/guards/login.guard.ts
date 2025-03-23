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
import { jwtConstants, IS_PUBLIC_KEY } from '../constants';
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
    const request = context.switchToHttp().getRequest();

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
      const payload: JWTPayload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload;
    } catch (e) {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    return request.headers.authorization;
  }
}
