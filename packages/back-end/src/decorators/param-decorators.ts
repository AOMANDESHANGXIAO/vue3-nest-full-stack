// 自定义参数装饰器
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Base64 } from 'js-base64';

// 如果你喜欢query风格，那么你可以使用这个装饰器
export const Base64Query = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const query = request.query;
    console.log('Base64Params query', query);
    const value = query[data as string];
    if (!value) {
      return null; // Return null if the parameter is not found
    }
    const obj = JSON.parse(Base64.decode(value));
    // Implement your custom logic here
    // For example, return a specific property from the request object
    return obj;
  },
);
// 在进行复杂查询时，我们可能会将查询的条件写到一个json中
// 然后将json进行base64编码，然后将编码后的字符串作为参数传递给后端
// 这个装饰器可以帮助我们将base64编码的字符串解码为json对象
export const Base64ToJsonParam = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const params = request.params;
    const value = params[data as string];
    if (!value) {
      return null; // Return null if the parameter is not found
    }
    const obj = JSON.parse(Base64.decode(value));
    return obj;
  },
);
