import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { type Repository } from 'typeorm';
import { type CreateUserDto } from './dto/create-user.dto';
import { type FindOneUserApiResult } from '@v3-nest-full-stack/shared-types';
import * as bcrypt from 'bcrypt';
import * as _ from 'lodash';
import { Request } from 'express';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<{
    user: Omit<User, 'password'>;
  }> {
    // 检查账号是否已存在
    const existingUser = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });

    if (existingUser) {
      throw new ConflictException('账号已存在');
    }

    // 对密码进行哈希处理
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    // 创建新用户
    const newUser = this.userRepository.create({
      username: createUserDto.username,
      password: hashedPassword,
      nickname: createUserDto.nickname,
    });

    // 保存用户到数据库
    const result = await this.userRepository.save(newUser);
    // 注册成功
    return {
      user: _.omit(result, ['password']),
    };
  }

  async findRolesById(id: string) {
    return await this.userRepository.findOne({
      where: { id },
      relations: ['roles', 'roles.permissions'],
    });
  }

  findAll() {
    throw new Error('Method not implemented.');
    // return `This action returns all users`;
  }

  async findOne(req: Request): Promise<FindOneUserApiResult> {
    const user = req.user
    return {
      user: _.omit(
        await this.userRepository.findOne({
          where: { id: user.uuid, status: true },
        }),
        ['password'],
      ),
    };
  }

  async remove(id: string) {
    const user = await this.userRepository.findOne({
      where: { id, status: true },
    });
    if (!user) {
      throw new Error('用户不存在');
    }
    user.status = false;
    await this.userRepository.save(user);
    return {};
  }
}
