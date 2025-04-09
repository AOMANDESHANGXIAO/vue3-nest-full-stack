import {
  Controller,
  Post,
  Patch,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Body,
  Request,
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { RequireLogin } from 'src/decorators/custom-decorator';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { Request as ExpressRequest } from 'express';
import { Base64ToJsonParam } from 'src/decorators/param-decorators';

@RequireLogin()
@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  // 增删改查
  @Post()
  async create(
    @Body() createPermissionDto: CreatePermissionDto,
    @Request() req: ExpressRequest,
  ) {
    return this.permissionService.create(createPermissionDto, req.user.uuid);
  }

  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string) {}

  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {}

  @Get()
  async findAll(@Base64ToJsonParam('params') params: any) {
    return await this.permissionService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.permissionService.findOne(id);
  }
}
