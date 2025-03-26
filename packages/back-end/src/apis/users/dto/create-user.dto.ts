import { IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { type CreateUserDtoInterface } from '@v3-nest-full-stack/shared-types';

export class CreateUserDto implements CreateUserDtoInterface {
  @MinLength(3)
  @MaxLength(20)
  @IsString()
  @Matches(/^[a-zA-Z][a-zA-Z0-9_]{3,20}$/, {
    message: '用户名必须以字母开头,允许字母数字下划线',
  })
  username: string;

  @MinLength(6)
  @MaxLength(15)
  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,15}$/, {
    message: '密码必须包含至少一个大写字母、一个小写字母和一个数字',
  })
  password: string;

  @MinLength(2)
  @MaxLength(20)
  @IsString()
  @Matches(/^[\u4e00-\u9fa5a-zA-Z0-9_\-\s·]+$/, {
    message: '昵称只能包含中文、字母、数字、下划线、横线、空格和点',
  })
  nickname: string;
}
