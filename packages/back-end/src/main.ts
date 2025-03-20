import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './interceptors/response.interceptor';
import { AllExceptionFilter } from './interceptors/exception.filter';
import { AuthGuard } from './guards/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new AllExceptionFilter());
  app.useGlobalGuards(new AuthGuard(new JwtService(), new Reflector()));
  await app.listen(3000);
  console.log(`Application is running on: http://localhost:${3000}`);
}
bootstrap();
