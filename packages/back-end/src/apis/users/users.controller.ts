import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Request,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { RequireLogin, isPublic } from 'src/decorators/custom-decorator';
import { Request as ExpressRequest } from 'express';
import { AddUserDto } from './dto/add-user.dto';
import { QueryUserDto } from './dto/query-user.dto';

@RequireLogin()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @isPublic()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('/add')
  addUser(@Body() addUserDto: AddUserDto, @Request() req: ExpressRequest) {
    return this.usersService.addUser(addUserDto, req);
  }

  /**
   * 根据用户token中解析的uuid查询用户信息,
   * 这样的好处是用户只能查询自己的信息,
   * 而不能查询其他用户的信息, 防止用户信息泄露
   */
  @Get()
  findOne(@Request() req: ExpressRequest) {
    return this.usersService.findOne(req);
  }

  @Get('/all')
  findAll(@Query('query') query: string) {
    const obj: QueryUserDto = JSON.parse(query);
    console.log('get all query', query);
    return this.usersService.findAll(obj.current, obj.pageSize, obj);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: ExpressRequest,
  ) {
    return this.usersService.update(id, updateUserDto, req);
  }
}
