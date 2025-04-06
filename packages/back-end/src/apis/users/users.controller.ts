import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { RequireLogin, isPublic } from 'src/decorators/custom-decorator';
import { Request as ExpressRequest } from 'express';
import { AddUserDto } from './dto/add-user.dto';

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
  findAll(
    @Query('current', ParseIntPipe) current: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
  ) {
    return this.usersService.findAll(current, pageSize);
  }
}
