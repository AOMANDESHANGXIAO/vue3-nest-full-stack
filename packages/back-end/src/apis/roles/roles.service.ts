import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/entities/role.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { Request } from 'express';
import { GetRoleListResult } from '@v3-nest-full-stack/shared-types';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findAll(size: number, page: number): Promise<GetRoleListResult> {
    const [data, total] = await this.roleRepository.findAndCount({
      take: size,
      skip: (page - 1) * size,
      relations: { createdBy: true, updatedBy: true },
    });
    return { list: data, total };
  }

  async findOne(id: string) {}

  async create(createRoleDto: CreateRoleDto, req: Request) {
    const user = await this.userRepository.findOneBy({ id: req.user.uuid });
    await this.roleRepository.save({
      ...createRoleDto,
      createdBy: user,
      updatedBy: user,
    });
    return {};
  }

  async update() {}

  async delete() {}
}
