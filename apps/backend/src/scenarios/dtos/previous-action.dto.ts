import { ApiProperty } from '@nestjs/swagger';
import { Position } from '../enums/position.enum';
import { ActionType } from '../../ranges/enums/action-type.enum';

export class PreviousActionDto {
  @ApiProperty({
    enum: Object.values(Position),
    description: 'Position that took this action',
    example: Position.CO,
  })
  position: Position;

  @ApiProperty({
    enum: Object.values(ActionType),
    description: 'Type of action taken',
    example: ActionType.RAISE,
  })
  actionType: ActionType;

  @ApiProperty({
    description: 'Bet/raise size in big blinds (required for raises)',
    required: false,
    example: 2.0,
  })
  sizing?: number;
}
