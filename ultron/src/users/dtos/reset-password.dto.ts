// External libraries
import { IsNotEmpty, MinLength } from 'class-validator';

// DTOs
import TokenDto from 'src/users/dtos/confirm-email.dto';

export class ResetPwdDto extends TokenDto {
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
