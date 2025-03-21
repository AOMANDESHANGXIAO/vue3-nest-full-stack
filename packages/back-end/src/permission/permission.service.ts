import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from 'src/entities/permission.entity';
// import { PermissionEnum } from '@v3-nest-full-stack/shared';
import { config } from 'src/config';

@Injectable()
export class PermissionService implements OnModuleInit {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async onModuleInit() {
    console.log('PermissionService OnModuleInit');
    await this.initialize();
  }

  async initialize() {
    if (await this.permissionRepository.count()) return;
    await this.permissionRepository.save(config.permissions);
    return true;
  }
}
