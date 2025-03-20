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
    console.log('server-exception:', exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // 检查异常是否为HttpException
    if (exception instanceof HttpException) {
      // 如果是HttpException，则不进行处理，让框架默认处理
      return;
    }
    // 处理非HttpException的异常
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
