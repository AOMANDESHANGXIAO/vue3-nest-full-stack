import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import * as moment from 'moment';
import { ApiResponse } from '@v3-nest-full-stack/shared';

@Catch()
export class ServerExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    if (exception instanceof HttpException) {
      return;
    }
    // 开发模式下，打印错误栈
    console.log('dev:server-exception:', exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const message = 'Internal server error';
    const res: ApiResponse<any> = {
      code: status,
      message,
      success: false,
      timestamp: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
      data: null,
    };
    response.status(status).json(res);
  }
}
