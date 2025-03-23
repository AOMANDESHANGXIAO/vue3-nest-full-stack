import { Controller, Get, Post, Request } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { Reflector } from '@nestjs/core';
import { ResourceService } from './resource.service';
import { Public } from 'src/decorators/custom-decorator';

@Controller('resource')
export class ResourceController {
  constructor(
    private readonly resourceService: ResourceService,
    private reflector: Reflector,
  ) {}

  @Public()
  @Get('all')
  getAllApis(@Request() req: ExpressRequest) {
    return this.resourceService.getAllApis(req);
  }

  @Public()
  @Post('sync')
  syncAllApis(@Request() req: ExpressRequest) {
    return this.resourceService.syncAllApis(req);
  }
}
