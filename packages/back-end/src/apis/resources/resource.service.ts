import { Injectable, Request } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request as ExpressRequest, Router } from 'express';
import { Repository } from 'typeorm';
import { Resource } from 'src/entities/resource.entity';
import { MetadataScanner, ModulesContainer } from '@nestjs/core';
import { Reflector } from '@nestjs/core';

@Injectable()
export class ResourceService {
  constructor(
    @InjectRepository(Resource)
    private resourceRepository: Repository<Resource>,
    private readonly modulesContainer: ModulesContainer,
    private readonly metadataScanner: MetadataScanner,
    private readonly reflector: Reflector,
  ) {}

  getAllControllers() {
    // 获取所有的模块
    console.log('modulesContainer', this.modulesContainer);
    const modules = [...this.modulesContainer.values()];
    const controllers = [];

    for (const module of modules) {
      for (const controller of [...module.controllers.values()]) {
        const instance = controller.instance;
        const prototype = Object.getPrototypeOf(instance);
        const controllerPath = this.reflector.get('path', controller.metatype);

        const methods = this.metadataScanner.scanFromPrototype(
          instance,
          prototype,
          (methodName) => {
            const routePath = this.reflector.get('path', instance[methodName]);
            const requestMethod = this.reflector.get(
              'method',
              instance[methodName],
            );

            return {
              methodName,
              routePath,
              requestMethod,
            };
          },
        );

        controllers.push({
          controller: controller.metatype.name,
          path: controllerPath,
          methods: methods.filter((m) => m.routePath), // 过滤掉没有路由的方法
        });
      }
    }
    console.log('controllers', controllers);
    return controllers;
  }
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
