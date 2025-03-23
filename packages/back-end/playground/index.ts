import { ExecutionContext } from '@nestjs/common';
import { config } from 'src/config';
export const getRequestPath = (context: ExecutionContext) => {
  // 获取请求的元信息
  // ...
  const request = context.switchToHttp().getRequest();
  const method = request.method;
  console.log('method', method);

  // 获取匹配的路由信息
  const handler = context.getHandler(); // 获取路由处理函数
  const controller = context.getClass(); // 获取控制器类
  const routePath = Reflect.getMetadata('path', handler); // 获取路由路径
  const controllerPath = Reflect.getMetadata('path', controller); // 获取控制器路径
  // 这样能获取到匹配的路由路径，可以请求数据库，并进行身份的验证...
  const fullRoutePath = `${config.globalPrefix}/${controllerPath}/${routePath}`; // 完整路由路径
  // 控制器路径/路由路径
  return fullRoutePath;
};
