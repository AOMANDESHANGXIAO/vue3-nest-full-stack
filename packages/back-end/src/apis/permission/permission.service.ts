import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from 'src/entities/permission.entity';
import { Role } from 'src/entities/role.entity';


@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async findAll() {
    return await this.permissionRepository.find();
  }

  async findOne(id: string) {
    return await this.permissionRepository.findOneBy({ id });
  }
}
