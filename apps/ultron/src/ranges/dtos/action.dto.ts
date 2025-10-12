import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ActionType } from '../schemas/action-type.enum';

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
    description: 'The percentage for this action',
    example: 100,
    minimum: 0,
    maximum: 100,
  })
  @IsNumber()
  @IsNotEmpty()
  percentage: number;
}
