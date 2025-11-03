import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ActionType } from '../enums/action-type.enum';

export class ActionDto {
  @ApiProperty({
    enum: ActionType,
    description: 'The type of action',
    example: ActionType.FOLD,
  })
  @IsEnum(ActionType)
  @IsNotEmpty()
  type: ActionType;

  @ApiProperty({
    description: 'The frequency for this action (0-100)',
    example: 100,
    minimum: 0,
    maximum: 100,
  })
  @IsNumber()
  @IsNotEmpty()
  frequency: number;

  @ApiProperty({
    description: 'Expected value (in big blinds) - Optional, not part of MVP',
    example: 2.45,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  ev?: number;

  @ApiProperty({
    description: "Equity vs opponent's range (0-100) - Optional, not part of MVP",
    example: 58.3,
    minimum: 0,
    maximum: 100,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  equity?: number;
}
