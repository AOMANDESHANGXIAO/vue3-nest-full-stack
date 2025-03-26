import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './interceptors/response.interceptor';
import { AllExceptionFilter } from './interceptors/exception.filter';
import { ValidationPipe } from './validation/validation.pipe';
import configuration from 'src/config/configuration';

const config = configuration();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(config.api.prefix);
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new AllExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.listen(config.port);
  console.log(`Application is running on: http://localhost:${config.port}`);
}
bootstrap();
