import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/apis/users/users.module';
import { RolesModule } from 'src/apis/roles/roles.module';
import { AuthModule } from 'src/apis/auth/auth.module';
import { DictsModule } from 'src/apis/dicts/dicts.module';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { ResourceModule } from 'src/apis/resources/resource.module';
import { PermissionModule } from 'src/apis/permission/permission.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import configuration from 'src/config/configuration';
import { LoginGuard } from 'src/guards/login/login.guard';
import { PermissionGuard } from 'src/guards/permission/permission.guard';
import { ValidationPipe } from './pipes/validation.pipe';

@Module({
  /**
   * RoleModule必须在PermissionModule之前加载，因为PermissionModule需要RoleModule先加载Role
   */
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: configuration().database.sqlite.file,
      autoLoadEntities: true,
      synchronize: configuration().database.sqlite.synchronize,
    }),
    UsersModule,
    RolesModule,
    ResourceModule,
    AuthModule,
    ResourceModule,
    PermissionModule,
    DictsModule,
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtService,
    { provide: APP_GUARD, useClass: LoginGuard },
    { provide: APP_GUARD, useClass: PermissionGuard },
    { provide: APP_PIPE, useClass: ValidationPipe },
  ],
})
export class AppModule {}
