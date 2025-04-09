import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './interceptors/response.interceptor';
import { AllExceptionFilter } from './interceptors/exception.filter';
import configuration from 'src/config/configuration';

const config = configuration();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(config.api.prefix);
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new AllExceptionFilter());
  app.enableCors();
  await app.listen(config.port);

  console.log(`Application is running on: http://localhost:${config.port}/${config.api.prefix}`);
}
bootstrap();
