// External libraries
import { IsString, IsNotEmpty } from 'class-validator';

/**
 * TokenDto includes string token
 */
export default class TokenDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}
