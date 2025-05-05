// External libraries
import { IsEmail } from 'class-validator';

export default class EmailDto {
  @IsEmail()
  email: string;
}
