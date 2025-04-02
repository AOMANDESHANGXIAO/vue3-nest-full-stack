import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login-dto';
import { User } from 'src/entities/user.entity';
import { Role } from 'src/entities/role.entity';
import {type LoginApiResult} from '@v3-nest-full-stack/shared-types'
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginApiResult> {
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
