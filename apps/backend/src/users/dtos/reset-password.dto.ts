// External libraries
import { IsNotEmpty, MinLength } from 'class-validator';

// DTOs
import TokenDto from './confirm-email.dto';

export class ResetPwdDto extends TokenDto {
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
