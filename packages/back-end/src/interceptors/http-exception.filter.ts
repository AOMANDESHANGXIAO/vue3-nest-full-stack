import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import * as moment from 'moment';
import type { ApiResponse } from '@v3-nest-full-stack/shared';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const res: ApiResponse<any> = {
      code: status,
      message: exception.message,
      success: false,
      timestamp: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
      data: null,
    };
    response.status(status).json(res);
  }
}
