import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { DictsService } from './dicts.service';
import { CreateDictDto } from './dto/create-dict.dto';
import { UpdateDictDto } from './dto/update-dict.dto';
import { RequireLogin } from 'src/decorators/custom-decorator';

@RequireLogin()
@Controller('dicts')
export class DictsController {
  constructor(private readonly dictsService: DictsService) {}

  @Post()
  create(@Body() createDictDto: CreateDictDto, @Request() req: ExpressRequest) {
    return this.dictsService.create(createDictDto, req);
  }

  @Get()
  findAll(
    @Query('current', ParseIntPipe) current: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
  ) {
    return this.dictsService.findAll(current, pageSize);
  }

  @Get(':code')
  findOne(@Param('code') code: string) {
    return this.dictsService.findOne(code);
  }
  // 这个接口将所有的字典数据都返回给前端,让前端可以根据字典编码快速获取字典值
  @Get("all/details")
  findAllDetails() {
    return this.dictsService.getAllDictDetails(); 
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDictDto: UpdateDictDto) {
    return this.dictsService.update(+id, updateDictDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dictsService.remove(+id);
  }
}
