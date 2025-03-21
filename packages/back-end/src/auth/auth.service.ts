import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
@Injectable()
export class AuthService {
  // TODO: 实现用户的注册，登录等功能

  // 业务用户注册
  async createUser(createUserDto: CreateUserDto) {
    return createUserDto;
  }
}
