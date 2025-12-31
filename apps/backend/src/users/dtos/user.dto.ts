// External libraries
import { IsEmail, IsNotEmpty, IsUUID, Length, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Login Dto
 */
export class LoginDto {
  @ApiProperty({ description: 'Username', example: 'jmontero' })
  @IsNotEmpty()
  @Length(6, 20)
  username: string;

  @ApiProperty({ description: 'Password (min 8 chars)', example: 'password123' })
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

/**
 * Register Dto
 */
export class RegisterDto extends LoginDto {
  @ApiProperty({ description: 'Email address', example: 'user@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

/**
 * User DTO
 */
export class UserDto extends RegisterDto {
  @ApiProperty({ format: 'uuid', description: 'User UUID' })
  @IsNotEmpty()
  @IsUUID()
  uuid: string;
}
