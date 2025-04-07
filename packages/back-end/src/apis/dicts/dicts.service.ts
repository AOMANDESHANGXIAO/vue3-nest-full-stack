import { Injectable, Inject } from '@nestjs/common';
import { CreateDictDto } from './dto/create-dict.dto';
import { UpdateDictDto } from './dto/update-dict.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/apis/users/users.service';
import { Dict } from 'src/entities/dict.entity';
import { DictDetail } from 'src/entities/dict_detail.entity';
import { Repository } from 'typeorm';
import { Request } from 'express';


@Injectable()
export class DictsService {
  @InjectRepository(Dict) private readonly dictRepository: Repository<Dict>;
  @InjectRepository(DictDetail)
  private readonly dictDetailRepository: Repository<DictDetail>;
  @Inject(UsersService) private readonly usersService: UsersService;
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

  async findAll() {
    const res = await this.dictRepository.find();
    return res;
  }

  async findOne(code: string) {
    const dict = await this.dictRepository.findOne({
      where: { code, status: 1 },
      relations: ['details'],
    })
    return dict;
  }

  update(id: number, updateDictDto: UpdateDictDto) {
    return `This action updates a #${id} dict`;
  }

  remove(id: number) {
    return `This action removes a #${id} dict`;
  }
}
