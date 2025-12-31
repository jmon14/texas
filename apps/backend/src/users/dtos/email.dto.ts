// External libraries
import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class EmailDto {
  @ApiProperty({ description: 'User email address', example: 'user@example.com' })
  @IsEmail()
  email: string;
}
