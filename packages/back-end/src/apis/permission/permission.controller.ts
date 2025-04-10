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
import { QueryPermissionDto } from './dto/query-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@RequireLogin()
@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  async create(
    @Body() createPermissionDto: CreatePermissionDto,
    @Request() req: ExpressRequest,
  ) {
    return this.permissionService.create(createPermissionDto, req.user.uuid);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
    @Request() req: ExpressRequest,
  ) {
    return this.permissionService.update(id, updatePermissionDto, req.user.uuid);
  }

  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {}

  @Get(':params')
  async findAll(@Base64ToJsonParam('params') params: QueryPermissionDto) {
    return this.permissionService.findAll(params);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.permissionService.findOne(id);
  }
}
