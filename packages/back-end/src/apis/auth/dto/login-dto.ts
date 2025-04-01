import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { LoginDtoInterface } from '@v3-nest-full-stack/shared-types';

export class LoginDto implements LoginDtoInterface {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: '用户名只能包含字母、数字和下划线',
  })
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(15)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,15}$/, {
    message: '密码必须包含至少一个大写字母、一个小写字母和一个数字',
  })
  password: string;
}
