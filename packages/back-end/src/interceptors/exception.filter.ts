import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import * as moment from 'moment';
import type { ApiResponse } from '@v3-nest-full-stack/shared-types';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    console.log('exception', exception);
    const isHttpException = exception instanceof HttpException;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const code = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = (exception as HttpException).message
      ? (exception as HttpException).message
      : 'Internal server error';
    const timestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    const res: ApiResponse<any> = {
      code,
      message,
      success: false,
      timestamp,
      data: null,
    };
    response.status(code).json(res);
  }
}
