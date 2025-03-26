import {
  Controller,
  Post,
  Patch,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { RequireLogin } from 'src/decorators/custom-decorator';

@RequireLogin()
@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  // 增删改查
  @Post()
  async create() {}

  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string) {}

  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {}

  @Get()
  async findAll() {
    return await this.permissionService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.permissionService.findOne(id);
  }
}
