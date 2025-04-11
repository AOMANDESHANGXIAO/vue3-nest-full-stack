import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/entities/role.entity';
import { User } from 'src/entities/user.entity';
import { Permission } from 'src/entities/permission.entity';
import { In, Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Request } from 'express';
import type {
  GetRoleListResult,
  GetAllRolesResult,
} from '@v3-nest-full-stack/shared-types';
import { STATUS } from '@v3-nest-full-stack/shared-types';
import { QueryRoleDto } from './dto/query-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async findAll(keyWord?: string): Promise<GetAllRolesResult> {
    const queryBuilder = this.roleRepository
      .createQueryBuilder('role')
      .leftJoinAndSelect('role.createdBy', 'createdBy')
      .leftJoinAndSelect('role.updatedBy', 'updatedBy')
      .leftJoinAndSelect(
        'role.permissions',
        'permissions',
        'permissions.status = :status',
        { status: STATUS.ENABLE },
      )
      .orderBy('role.createTime', 'DESC');

    if (keyWord) {
      queryBuilder.andWhere('role.name LIKE :name', { name: `%${keyWord}%` });
    }

    const roles = await queryBuilder.getMany();
    return { list: roles };
  }

  async findByPage(params: QueryRoleDto): Promise<GetRoleListResult> {
    const { current, pageSize, conditions } = params;
    const queryBuilder = this.roleRepository
      .createQueryBuilder('role')
      .leftJoinAndSelect('role.createdBy', 'createdBy')
      .leftJoinAndSelect('role.updatedBy', 'updatedBy')
      .leftJoinAndSelect(
        'role.permissions',
        'permissions',
        'permissions.status = :status',
        { status: STATUS.ENABLE },
      )
      .orderBy('role.createTime', 'DESC')
      .take(pageSize)
      .skip((current - 1) * pageSize);

    if (conditions) {
      if (conditions.name) {
        queryBuilder.andWhere('role.name LIKE :name', {
          name: `%${conditions.name}%`,
        });
      }
    }

    const [list, total] = await queryBuilder.getManyAndCount();
    return { list, total };
  }

  async create(createRoleDto: CreateRoleDto, req: Request) {
    const user = await this.userRepository.findOneBy({ id: req.user.uuid });
    const permissions = await this.permissionRepository.find({
      where: { id: In(createRoleDto.permissionIds) },
    });
    await this.roleRepository.save({
      ...createRoleDto,
      permissions,
      createdBy: user,
      updatedBy: user,
    });
    return {};
  }

  async update(id: string, updateRoleDto: UpdateRoleDto, req: Request) {
    const role = await this.roleRepository.findOneBy({ id });
    if (!role) throw new Error('Role not found');
    const user = await this.userRepository.findOneBy({ id: req.user.uuid });
    const permissions = await this.permissionRepository.find({
      where: { id: In(updateRoleDto.permissionIds) },
    });
    const newRole = await this.roleRepository.save({
      ...role,
      ...updateRoleDto,
      permissions,
      updatedBy: user,
    });
    return newRole;
  }

  async delete(id: string, req: Request) {
    const role = await this.roleRepository.findOneBy({ id });
    if (!role) throw new Error('Role not found');
    const user = await this.userRepository.findOneBy({ id: req.user.uuid });
    await this.roleRepository.save({
      ...role,
      status: STATUS.DISABLE,
      updatedBy: user,
    });
    return {};
  }
}
