import { Injectable, Request } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request as ExpressRequest, Router } from 'express';
import { Repository } from 'typeorm';
import { Resource } from 'src/entities/resource.entity';

@Injectable()
export class ResourceService {
  constructor(
    @InjectRepository(Resource)
    private resourceRepository: Repository<Resource>,
  ) {}
  // 获取所有的后端api地址
  getAllApis(@Request() req: ExpressRequest) {
    const router = req.app._router as Router;
    return {
      routes: router.stack
        .map((layer) => {
          if (layer.route) {
            const path = layer.route?.path;
            const method = layer.route?.stack[0].method;
            return {
              method: method.toUpperCase(),
              path,
            };
          }
        })
        .filter((item) => item !== undefined),
    };
  }
  // TODO: 写一个方法，将所有的后端api地址存储到数据库中
  async syncAllApis(@Request() req: ExpressRequest) {
    // 查询已经保存的资源
    const existingResources = await this.resourceRepository.find();
    // 获取所有的后端api地址
    const currentResources = this.getAllApis(req);
    // 比较两个数组，将不同的api地址存储到数据库中
    const newResources = currentResources.routes.filter(
      (item) =>
        !existingResources.find(
          (resource) =>
            resource.path === item.path && resource.method === item.method,
        ),
    );
    if (newResources.length > 0) {
      await this.resourceRepository.save(newResources);
    }
    return {};
  }
}
