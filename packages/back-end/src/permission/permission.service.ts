import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from 'src/entities/permission.entity';
import { Role } from 'src/entities/role.entity';
import { PermissionEnum } from '@v3-nest-full-stack/shared-types';
// import { PermissionEnum } from '@v3-nest-full-stack/shared';
import { config } from 'src/config';

@Injectable()
export class PermissionService implements OnModuleInit {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async onModuleInit() {
    console.log('PermissionService OnModuleInit');
    // await this.initialize();
    await this.reset();
  }

  async initialize() {
    if (await this.permissionRepository.count()) return;
    await this.permissionRepository.save(config.permissions);
    // 为每一个role添加默认权限
    const roles = await this.roleRepository.find();
    const allPermissions = await this.permissionRepository.find();
    for (const role of roles) {
      const permissions = allPermissions.filter((item) => {
        return config.roles
          .find((item) => item.name === role.name)
          ?.permissions.includes(item.name as PermissionEnum);
      });
      role.permissions = permissions;
    }
    await this.roleRepository.save(roles);
    return true;
  }

  async reset() {
    await this.permissionRepository.delete({});
    await this.initialize();
    return true;
  }
}
