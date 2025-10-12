// External libraries
import { IsEmail, IsNotEmpty, IsUUID, Length, MinLength } from 'class-validator';

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
 * Register Dto
 */
export class RegisterDto extends LoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

/**
 * User DTO
 */
export class UserDto extends RegisterDto {
  @IsNotEmpty()
  @IsUUID()
  uuid: string;
}
