import { Module } from '@nestjs/common';
import { DictsService } from './dicts.service';
import { DictsController } from './dicts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dict } from 'src/entities/dict.entity';
import { DictDetail } from 'src/entities/dict_detail.entity';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [DictsController],
  providers: [DictsService],
  imports: [TypeOrmModule.forFeature([Dict, DictDetail]), UsersModule],
})
export class DictsModule {}
