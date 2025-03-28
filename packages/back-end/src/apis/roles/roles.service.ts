import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/entities/role.entity';
import { Repository } from 'typeorm';
import { config } from 'src/config';

@Injectable()
export class RolesService implements OnModuleInit {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}

  async onModuleInit() {
    console.log('RolesService OnModuleInit');
    await this.initialize();
  }

  async initialize() {
    if (await this.roleRepository.count()) return;
    const initRoles = config.roles.map((item) => ({ name: item.name }));
    await this.roleRepository.save(initRoles);
    return true;
  }

  async reset() {
    await this.roleRepository.delete({});
    await this.initialize();
    return true;
  }

  async findAll() {
    return await this.roleRepository.find();
  }

  async findOne(id: string) {}

  async create() {}

  async update() {}

  async delete() {}
}
