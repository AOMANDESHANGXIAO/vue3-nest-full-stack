import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResourceService } from './resource.service';
import { ResourceController } from './resource.controller';
import { Resource } from 'src/entities/resource.entity';
import { MetadataScanner, ModulesContainer } from '@nestjs/core';

@Module({
  imports: [TypeOrmModule.forFeature([Resource])],
  controllers: [ResourceController],
  providers: [ResourceService, MetadataScanner, ModulesContainer],
})
export class ResourceModule {}
