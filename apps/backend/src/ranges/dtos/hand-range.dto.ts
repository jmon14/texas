import { IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ActionDto } from './action.dto';

export class HandRangeDto {
  @ApiProperty({
    description: 'The carryover frequency from previous street (0-100)',
    example: 100,
    minimum: 0,
    maximum: 100,
  })
  @IsNumber()
  @IsNotEmpty()
  carryoverFrequency: number;

  @ApiProperty({
    description: 'The label for this hand range',
    example: 'AA, KK, QQ',
  })
  @IsString()
  @IsNotEmpty()
  label: string;

  @ApiProperty({
    type: [ActionDto],
    description: 'Array of actions for this hand range',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ActionDto)
  actions: ActionDto[];
}
