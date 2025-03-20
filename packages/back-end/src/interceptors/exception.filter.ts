import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import * as moment from 'moment';
import type { ApiResponse } from '@v3-nest-full-stack/shared';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const isHttpException = exception instanceof HttpException;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const res: ApiResponse<any> = {
      code: status,
      message: isHttpException ? exception.message : 'Internal server error',
      success: false,
      timestamp: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
      data: null,
    };
    response.status(status).json(res);
  }
}
