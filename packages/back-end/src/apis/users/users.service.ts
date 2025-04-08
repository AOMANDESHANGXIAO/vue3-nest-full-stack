import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Role } from 'src/entities/role.entity';
import { In, Not, Like } from 'typeorm';
import { type Repository } from 'typeorm';
import { type CreateUserDto } from './dto/create-user.dto';
import type {
  FindOneUserApiResult,
  FindAllUsersApiResult,
} from '@v3-nest-full-stack/shared-types';
import * as bcrypt from 'bcrypt';
// import * as _ from 'lodash';
import { Request } from 'express';
import { type UpdateUserDto } from './dto/update-user.dto';
import { AddUserDto } from './dto/add-user.dto';
import { STATUS } from '@v3-nest-full-stack/shared-types';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<any> {
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
    await this.userRepository.save(newUser);
    // 注册成功
    return {};
  }

  async addUser(addUserDto: AddUserDto, req: Request) {
    // 检查账号是否已存在
    const existingUser = await this.userRepository.findOne({
      where: { username: addUserDto.username },
    });

    if (existingUser) {
      throw new ConflictException('账号已存在');
    }

    // 对密码进行哈希处理
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(addUserDto.password, salt);
    // 如果必要则查找角色
    let roles: Role[] = [];
    if (addUserDto.roleIds) {
      roles = await this.roleRepository.findBy({
        id: In(addUserDto.roleIds),
      });
    }
    // 创建新用户
    const newUser = this.userRepository.create({
      username: addUserDto.username,
      password: hashedPassword,
      nickname: addUserDto.nickname,
      roles,
      createBy: req.user.uuid, // 假设用户信息存储在 req.user 中
    });
    // 保存用户到数据库
    const user = await this.userRepository.save(newUser);
    // 注册成功
    return {
      user,
    };
  }

  async findRolesById(id: string) {
    return await this.userRepository.findOne({
      where: { id },
      relations: ['roles', 'roles.permissions'],
    });
  }

  async findAll(
    current: number,
    pageSize: number,
    queryKeyWord?: {
      username?: string;
      nickname?: string;
      status?: STATUS;
      roleIds?: string[];
    },
  ): Promise<FindAllUsersApiResult> {
    const where: any = {};

    if (queryKeyWord?.username) {
      where.username = Like(`%${queryKeyWord.username}%`);
    }
    if (queryKeyWord?.nickname) {
      where.nickname = Like(`%${queryKeyWord.nickname}%`);
    }
    if (queryKeyWord?.status || queryKeyWord.status === 0) {
      where.status = queryKeyWord.status;
    }
    if (queryKeyWord?.roleIds) {
      where.roles = {
        id: In(queryKeyWord.roleIds),
      };
    }

    const [users, total] = await this.userRepository.findAndCount({
      where,
      relations: ['roles'],
      take: pageSize,
      skip: (current - 1) * pageSize,
    });
    return {
      list: users,
      total,
    };
  }

  async findOne(req: Request): Promise<FindOneUserApiResult> {
    const user = req.user;
    return {
      user: await this.userRepository.findOne({
        where: { id: user.uuid, status: STATUS.ENABLE },
      }),
    };
  }

  async findOneById(id: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { id, status: STATUS.ENABLE },
    });
  }

  async isUserExist(req: Request): Promise<boolean> {
    const user = await this.findOne(req);
    return !!user.user;
  }

  async remove(id: string) {
    const user = await this.userRepository.findOne({
      where: { id, status: STATUS.ENABLE },
    });
    if (!user) {
      throw new Error('用户不存在');
    }
    user.status = 0;
    await this.userRepository.save(user);
    return {};
  }

  async update(id: string, updateUserDto: UpdateUserDto, req: Request) {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new Error('用户不存在');
    }
    if (updateUserDto.username) {
      // 检查账号是否已存在
      const existingUser = await this.userRepository.findOne({
        where: { username: updateUserDto.username, id: Not(id) },
      });

      if (existingUser) {
        throw new ConflictException('账号已存在');
      }
    }

    // 如果密码被更新，则进行哈希处理
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    // 如果用户角色被更新
    if (updateUserDto.roleIds) {
      const roles = await this.roleRepository.findBy({
        id: In(updateUserDto.roleIds),
      });
      user.roles = roles;
    }
    Object.assign(user, updateUserDto);
    user.updateBy = req.user.uuid;
    await this.userRepository.save(user);
    return {};
  }
}
