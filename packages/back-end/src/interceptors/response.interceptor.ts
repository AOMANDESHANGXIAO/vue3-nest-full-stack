import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpStatus } from '@nestjs/common';
import * as moment from 'moment';
import { type ApiResponse } from '@v3-nest-full-stack/shared';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => ({
        code: HttpStatus.OK,
        message: '请求成功',
        success: true,
        timestamp: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
        data,
      })),
    );
  }
}
