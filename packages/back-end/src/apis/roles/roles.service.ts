import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}

  async findAll(size: number, page: number) {
    const [data, total] = await this.roleRepository.findAndCount({
      take: size,
      skip: (page - 1) * size,
    });
    return { list: data, total };
  }

  async findOne(id: string) {}

  async create() {}

  async update() {}

  async delete() {}
}
