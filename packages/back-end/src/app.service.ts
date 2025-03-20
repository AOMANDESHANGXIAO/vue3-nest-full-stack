import { Injectable } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
@Injectable()
export class AppService {
  getHello(): string {
    // return 'Hello World!';
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }
}
