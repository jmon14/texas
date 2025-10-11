import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { HandRangeDto } from './hand-range.dto';

export class CreateRangeDto {
  @ApiProperty({ description: 'The name of the range' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: [HandRangeDto], description: 'Array of hand ranges' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HandRangeDto)
  handsRange: HandRangeDto[];

  @ApiProperty({ description: 'The user ID who owns this range' })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
