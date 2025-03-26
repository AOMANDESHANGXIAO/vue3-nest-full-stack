import {
  Controller,
  Post,
  Patch,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  // 增删改查
  @Post()
  async create() {}

  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string) {}

  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {}

  @Get()
  async findAll(
    @Query('size', ParseIntPipe) size: number,
    @Query('page', ParseIntPipe) page: number,
  ) {
    return await this.rolesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.rolesService.findOne(id);
  }
}
