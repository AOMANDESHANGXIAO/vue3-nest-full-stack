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
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { RequireLogin } from 'src/decorators/custom-decorator';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Request as ExpressRequest } from 'express';

@RequireLogin()
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  // 增删改查
  @Post()
  async create(
    @Body() createRoleDto: CreateRoleDto,
    @Request() req: ExpressRequest,
  ) {
    return this.rolesService.create(createRoleDto, req);
  }

  @Delete(':id')
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: ExpressRequest,
  ) {
    return this.rolesService.delete(id, req);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @Request() req: ExpressRequest,
  ) {
    return this.rolesService.update(id, updateRoleDto, req);
  }

  @Get()
  async findByPage(
    @Query('pageSize', ParseIntPipe) pageSize: number,
    @Query('current', ParseIntPipe) current: number,
    @Query('keyWord') keyWord: string,
  ) {
    return this.rolesService.findByPage(pageSize, current, keyWord);
  }

  @Get('all')
  async findAll(@Query('keyWord') keyWord: string) {
    return this.rolesService.findAll(keyWord);
  }
}
