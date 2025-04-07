import { Injectable, Inject } from '@nestjs/common';
import { CreateDictDto } from './dto/create-dict.dto';
import { UpdateDictDto } from './dto/update-dict.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/apis/users/users.service';
import { Dict } from 'src/entities/dict.entity';
import { DictDetail } from 'src/entities/dict_detail.entity';
import { Repository } from 'typeorm';
import { Request } from 'express';
import type {
  DictListResult,
  FindOneDictResult,
} from '@v3-nest-full-stack/shared-types';

@Injectable()
export class DictsService {
  @InjectRepository(Dict) private readonly dictRepository: Repository<Dict>;
  @InjectRepository(DictDetail)
  private readonly dictDetailRepository: Repository<DictDetail>;
  @Inject(UsersService) private readonly usersService: UsersService;

  private dictFormatter(dict: Dict) {
    return dict.details.map((item) => {
      return {
        id: item.id,
        label: item.name,
        value: item.code,
      };
    });
  }

  async create(createDictDto: CreateDictDto, req: Request) {
    const existingCode = await this.dictRepository.findOne({
      where: { code: createDictDto.code },
    });
    if (existingCode) {
      throw new Error('字典编码已存在');
    }
    const user = await this.usersService.findOneById(req.user.uuid);
    if (!user) {
      throw new Error('用户不存在');
    }
    const dict = new Dict();
    dict.code = createDictDto.code;
    dict.name = createDictDto.name;
    dict.desc = createDictDto.desc;
    dict.createBy = user;
    const newDict = await this.dictRepository.save(dict);
    if (createDictDto.details) {
      const details = createDictDto.details.map((detail) => {
        const newDetail = new DictDetail();
        newDetail.dict_code = newDict; // 关联到新创建的字典
        newDetail.code = detail.code; // 编码示范,0,1,2
        newDetail.name = detail.name; // 名称示范 0:禁用 1:启用 2:删除
        return newDetail;
      });
      await this.dictDetailRepository.save(details);
    }
    return newDict;
  }

  async findAll(current: number, pageSize: number): Promise<DictListResult> {
    const [data, total] = await this.dictRepository.findAndCount({
      where: { status: 1 },
      take: pageSize,
      skip: (current - 1) * pageSize,
    });
    return {
      list: data,
      total,
    };
  }

  async findOne(code: string): Promise<FindOneDictResult> {
    const dict = await this.dictRepository.findOne({
      where: { code, status: 1 },
      relations: ['details'],
    });
    // formatter 格式化数据, 转换为list结构, 方便前端使用
    return {
      list: this.dictFormatter(dict),
    };
  }

  async getTransferText(code: string, dictCode: string) {
    const dict = await this.dictRepository.findOne({
      where: { code, status: 1 },
      relations: ['details'],
    });
    if (!dict) {
      throw new Error('字典不存在');
    }
    const detail = dict.details.find((item) => item.code === dictCode);
    if (!detail) {
      throw new Error('字典详情不存在');
    }
    return {
      text: detail.name,
    };
  }

  update(id: number, updateDictDto: UpdateDictDto) {
    return `This action updates a #${id} dict`;
  }

  remove(id: number) {
    return `This action removes a #${id} dict`;
  }
}
