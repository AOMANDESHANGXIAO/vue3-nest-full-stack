import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { RequireLogin, RequirePermission } from './decorators/custom-decorator';
import { PermissionEnum } from '@v3-nest-full-stack/shared-types';

@RequireLogin()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @RequirePermission(PermissionEnum.AdminQuery)
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
