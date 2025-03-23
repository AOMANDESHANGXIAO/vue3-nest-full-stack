import { Controller, Post } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Public } from 'src/decorators/custom-decorator';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  /**
   * 初始化角色
   */
  @Public()
  @Post('init')
  init() {
    return this.rolesService.initialize();
  }
}
