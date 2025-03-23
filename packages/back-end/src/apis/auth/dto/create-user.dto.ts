import { IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { AuthUserConstant } from 'src/constants';
// import { AuthUserConstant } from '@v3-nest-full-stack/shared';

const { username, password, nickname } = AuthUserConstant;
export class CreateUserDto {
  @MinLength(username.minLength)
  @MaxLength(username.maxLength)
  @IsString()
  @Matches(username.regex, {
    message: username.message,
  })
  username: string;

  @MinLength(password.minLength)
  @MaxLength(password.maxLength)
  @IsString()
  @Matches(password.regex, {
    message: password.message,
  })
  password: string;

  @MinLength(nickname.minLength)
  @MaxLength(nickname.maxLength)
  @IsString()
  @Matches(nickname.regex, {
    message: nickname.message,
  })
  nickname: string;
}
