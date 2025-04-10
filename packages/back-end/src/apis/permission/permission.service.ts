import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from 'src/entities/permission.entity';
import { Role } from 'src/entities/role.entity';
import { User } from 'src/entities/user.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { QueryPermissionDto } from './dto/query-permission.dto';
import type { QueryPermissionResult } from '@v3-nest-full-stack/shared-types';
import { UpdatePermissionDto } from './dto/update-permission.dto';

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

  async delete(id: string, userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });
    const permission = await this.permissionRepository.findOneBy({ id });
    if (!permission) {
      throw new Error('权限不存在');
    }
    permission.status = 0;
    permission.updateBy = user;
    return await this.permissionRepository.save(permission);
  }

  async update(id: string, data: UpdatePermissionDto, userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error('用户不存在');
    }
    const permission = await this.permissionRepository.findOneBy({ id });
    if (!permission) {
      throw new Error('权限不存在');
    }
    return await this.permissionRepository.update(id, {
      ...data,
      updateBy: user,
    });
  }

  async findAll(data: QueryPermissionDto): Promise<QueryPermissionResult> {
    const { pageSize, current, conditions } = data;
    // 构建queryBuilder
    const queryBuilder =
      this.permissionRepository.createQueryBuilder('permission');
    // 查询createBy和updateBy的用户信息
    queryBuilder.leftJoinAndSelect('permission.createBy', 'createBy');
    queryBuilder.leftJoinAndSelect('permission.updateBy', 'updateBy');
    // 处理查询条件
    if (conditions) {
      if (conditions.name) {
        queryBuilder.andWhere('permission.name LIKE :name', {
          name: `%${conditions.name}%`,
        });
      }
      if (conditions.status || conditions.status === 0) {
        queryBuilder.andWhere('permission.status = :status', {
          status: conditions.status,
        });
      }
    }
    // 处理分页
    queryBuilder.skip((current - 1) * pageSize).take(pageSize);
    // 获取结果
    const [list, total] = await queryBuilder.getManyAndCount();
    return { list, total };
  }

  async findOne(id: string) {
    return await this.permissionRepository.findOneBy({ id });
  }
}
