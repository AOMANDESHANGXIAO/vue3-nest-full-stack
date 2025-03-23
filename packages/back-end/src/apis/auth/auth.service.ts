import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login-dto';
import { User } from 'src/entities/user.entity';
import { Role } from 'src/entities/role.entity';
import { RoleEnum } from '@v3-nest-full-stack/shared-types';
import * as bcrypt from 'bcrypt';
import * as _ from 'lodash';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private jwtService: JwtService,
  ) {}

  // 业务用户注册
  async createUser(createUserDto: CreateUserDto) {
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
    // 查询roleEnum
    const role = await this.roleRepository.findOne({
      where: { name: RoleEnum.User },
    });
    console.log('role', role);
    // 创建新用户
    const newUser = this.userRepository.create({
      username: createUserDto.username,
      password: hashedPassword,
      nickname: createUserDto.nickname,
      roles: [role],
    });

    // 保存用户到数据库
    const result = await this.userRepository.save(newUser);
    // 设置角色, 这里注册的用户是普通用户 RoleEnum.User
    // 注册成功
    return _.omit(result, ['password']);
  }

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;
    // 查找用户
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['roles'], // 加载roles关系
    });

    // 验证用户是否存在
    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    // 生成JWT token
    const payload = {
      uuid: user.id,
      roles: user.roles.map((role) => role.name), // 提取角色名称
    };
    const accessToken = this.jwtService.sign(payload);

    // 返回token
    return {
      access_token: accessToken,
    };
  }

  async getUserPermissions(uuid: string) {
    // 根据用户ID查询用户信息，包括关联的角色
    const user = await this.userRepository.findOne({
      where: { id: uuid },
      relations: ['roles', 'roles.permissions'],
    });

    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }
    // 获取权限
    const permissions = user.roles.reduce((acc, role) => {
      return acc.concat(role.permissions);
    }, []);

    // 返回权限列表
    return permissions;
  }
}
