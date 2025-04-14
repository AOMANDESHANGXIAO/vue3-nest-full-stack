import {
  Controller,
  Post,
  Patch,
  Delete,
  Get,
  Param,
  Body,
  ParseUUIDPipe,
  Query,
  Request,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { RequireLogin } from 'src/decorators/custom-decorator';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { QueryRoleDto } from './dto/query-role.dto';
import { Request as ExpressRequest } from 'express';
import { Base64ToJsonParam } from 'src/decorators/param-decorators';
import { RequirePermission } from 'src/decorators/custom-decorator';

@RequireLogin()
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @RequirePermission('role:create')
  @Post()
  async create(
    @Body() createRoleDto: CreateRoleDto,
    @Request() req: ExpressRequest,
  ) {
    return this.rolesService.create(createRoleDto, req);
  }

  @RequirePermission('role:delete')
  @Delete(':id')
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: ExpressRequest,
  ) {
    return this.rolesService.delete(id, req);
  }

  @RequirePermission('role:update')
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @Request() req: ExpressRequest,
  ) {
    return this.rolesService.update(id, updateRoleDto, req);
  }

  @RequirePermission('role:read')
  @Get('page/:params')
  async findByPage(@Base64ToJsonParam('params') params: QueryRoleDto) {
    return this.rolesService.findByPage(params);
  }

  @RequirePermission('role:read')
  @Get('all')
  async findAll(@Query('keyWord') keyWord: string) {
    return this.rolesService.findAll(keyWord);
  }
}
