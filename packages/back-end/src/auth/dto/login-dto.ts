import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { AuthUserConstant } from 'src/constants';

const { username, password } = AuthUserConstant;
export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(username.minLength)
  @MaxLength(username.maxLength)
  @Matches(username.regex, {
    message: username.message,
  })
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(password.minLength)
  @MaxLength(password.maxLength)
  @Matches(password.regex, {
    message: password.message,
  })
  password: string;
}
