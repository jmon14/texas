import { ApiProperty } from '@nestjs/swagger';
import { Position } from '../enums/position.enum';
import { GameType } from '../enums/game-type.enum';
import { Difficulty } from '../enums/difficulty.enum';
import { Street } from '../enums/street.enum';
import { ScenarioActionType } from '../enums/scenario-action-type.enum';
import { BoardTexture } from '../enums/board-texture.enum';
import { Category } from '../enums/category.enum';
import { PreviousActionDto } from './previous-action.dto';

export class ScenarioResponseDto {
  @ApiProperty({
    description: 'The unique MongoDB identifier of the scenario',
    example: '507f1f77bcf86cd799439011',
  })
  _id: string;

  @ApiProperty({
    description: 'The name of the scenario',
    example: 'UTG Open - 100bb Tournament',
  })
  name: string;

  @ApiProperty({
    description: 'Detailed description of the scenario',
    example: 'You are UTG in a 100bb tournament. What should your opening range be?',
  })
  description: string;

  @ApiProperty({
    enum: Street,
    description: 'The street where this decision occurs',
    example: Street.PREFLOP,
  })
  street: Street;

  @ApiProperty({
    enum: GameType,
    description: 'The game type',
    example: GameType.TOURNAMENT,
  })
  gameType: GameType;

  @ApiProperty({
    enum: Object.values(Position),
    description: 'Hero position',
    example: Position.UTG,
  })
  position: Position;

  @ApiProperty({
    enum: Object.values(Position),
    description: 'Villain position',
    example: Position.BB,
  })
  vsPosition: Position;

  @ApiProperty({
    enum: ScenarioActionType,
    description: 'The scenario action type (what decision is being made)',
    example: ScenarioActionType.OPEN,
  })
  actionType: ScenarioActionType;

  @ApiProperty({
    description: 'Effective stack depth in big blinds',
    example: 100,
  })
  effectiveStack: number;

  @ApiProperty({
    description: 'Bet size in big blinds',
    example: 2.0,
  })
  betSize: number;

  @ApiProperty({
    type: [PreviousActionDto],
    description: 'Previous actions in the hand',
    required: false,
  })
  previousActions?: PreviousActionDto[];

  @ApiProperty({
    enum: BoardTexture,
    description: 'Board texture description (for post-flop scenarios, post-MVP)',
    required: false,
    example: BoardTexture.DRY,
  })
  boardTexture?: BoardTexture;

  @ApiProperty({
    enum: Difficulty,
    description: 'Difficulty level',
    example: Difficulty.BEGINNER,
  })
  difficulty: Difficulty;

  @ApiProperty({
    enum: Category,
    description: 'Category of the scenario',
    example: Category.OPENING_RANGES,
  })
  category: Category;

  @ApiProperty({
    type: [String],
    description: 'Tags for filtering and organization',
    example: ['tournament', '6max', 'preflop'],
  })
  tags: string[];

  @ApiProperty({
    description: 'Creation timestamp',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
  })
  updatedAt: Date;
}
