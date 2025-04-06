import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/entities/role.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Request } from 'express';
import { GetRoleListResult } from '@v3-nest-full-stack/shared-types';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findAll(
    pageSize: number,
    current: number,
    keyWord?: string,
  ): Promise<GetRoleListResult> {
    const queryBuilder = this.roleRepository
      .createQueryBuilder('role')
      .leftJoinAndSelect('role.createdBy', 'createdBy')
      .leftJoinAndSelect('role.updatedBy', 'updatedBy')
      .where('role.status = :status', { status: true })
      .orderBy('role.createTime', 'DESC')
      .take(pageSize)
      .skip((current - 1) * pageSize);

    if (keyWord) {
      queryBuilder.andWhere('role.name LIKE :name', { name: `%${keyWord}%` });
    }

    const [data, total] = await queryBuilder.getManyAndCount();
    return { list: data, total };
  }

  async create(createRoleDto: CreateRoleDto, req: Request) {
    const user = await this.userRepository.findOneBy({ id: req.user.uuid });
    await this.roleRepository.save({
      ...createRoleDto,
      createdBy: user,
      updatedBy: user,
    });
    return {};
  }

  async update(id: string, updateRoleDto: UpdateRoleDto, req: Request) {
    const role = await this.roleRepository.findOneBy({ id });
    if (!role) throw new Error('Role not found');
    const user = await this.userRepository.findOneBy({ id: req.user.uuid });
    const newRole = await this.roleRepository.save({
      ...role,
      ...updateRoleDto,
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
      status: false,
      updatedBy: user,
    });
    return {};
  }
}
