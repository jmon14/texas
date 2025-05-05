// External libraries
import { IsEmail, IsNotEmpty, Length, MinLength } from 'class-validator';

/**
 * Login Dto
 */
export class LoginDto {
  @IsNotEmpty()
  @Length(6, 20)
  username: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

/**
 * User DTO
 */
export class UserDto extends LoginDto {
  @IsEmail()
  email: string;
}
