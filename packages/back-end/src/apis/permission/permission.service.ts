import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from 'src/entities/permission.entity';
import { Role } from 'src/entities/role.entity';
import { User } from 'src/entities/user.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(data: CreatePermissionDto, userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error('用户不存在');
    }
    const permission = this.permissionRepository.create({
      ...data,
      createBy: user,
      updateBy: user,
    });
    return await this.permissionRepository.save(permission);
  }

  async findAll() {
    return await this.permissionRepository.find();
  }

  async findOne(id: string) {
    return await this.permissionRepository.findOneBy({ id });
  }
}
