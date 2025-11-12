import {
  IsString,
  IsEnum,
  IsNumber,
  IsArray,
  IsOptional,
  IsNotEmpty,
  ValidateNested,
  Matches,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Position } from '../enums/position.enum';
import { GameType } from '../enums/game-type.enum';
import { Difficulty } from '../enums/difficulty.enum';
import { Street } from '../enums/street.enum';
import { ScenarioActionType } from '../enums/scenario-action-type.enum';
import { Category } from '../enums/category.enum';
import { BoardTexture } from '../enums/board-texture.enum';
import { PreviousActionDto } from './previous-action.dto';
import { IsRequiredIfPostFlop } from './validators/required-if-postflop.validator';

export class CreateScenarioDto {
  @ApiProperty({
    description: 'The name of the scenario',
    example: 'UTG Open - 100bb Tournament',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Detailed description of the scenario',
    example: "You're UTG in a 100bb tournament. What should your opening range be?",
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    enum: Street,
    description: 'The street where this decision occurs',
    example: Street.PREFLOP,
  })
  @IsEnum(Street)
  @IsNotEmpty()
  street: Street;

  @ApiProperty({
    enum: GameType,
    description: 'The game type',
    example: GameType.TOURNAMENT,
  })
  @IsEnum(GameType)
  @IsNotEmpty()
  gameType: GameType;

  @ApiProperty({
    enum: Object.values(Position),
    description: 'Hero position',
    example: Position.UTG,
  })
  @IsEnum(Position)
  @IsNotEmpty()
  position: Position;

  @ApiProperty({
    enum: Object.values(Position),
    description: 'Villain position',
    example: Position.BB,
  })
  @IsEnum(Position)
  @IsNotEmpty()
  vsPosition: Position;

  @ApiProperty({
    enum: ScenarioActionType,
    description: 'The scenario action type (what decision is being made)',
    example: ScenarioActionType.OPEN,
  })
  @IsEnum(ScenarioActionType)
  @IsNotEmpty()
  actionType: ScenarioActionType;

  @ApiProperty({
    description: 'Effective stack depth in big blinds',
    example: 100,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  effectiveStack: number;

  @ApiProperty({
    description: 'Bet size in big blinds',
    example: 2.0,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  betSize: number;

  @ApiProperty({
    type: [PreviousActionDto],
    description: 'Previous actions in the hand',
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PreviousActionDto)
  @IsOptional()
  previousActions?: PreviousActionDto[];

  @ApiProperty({
    description:
      'Board cards in format "As Kh 7d" (3 cards for flop, 4 for turn, 5 for river). ' +
      'Required for post-flop scenarios.',
    example: 'As Kh 7d',
    required: false,
  })
  @IsRequiredIfPostFlop()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Matches(/^([A2-9TJQK][hscd]\s?){3,5}$/, {
    message: 'boardCards must be in format "As Kh 7d" with 3-5 cards',
  })
  boardCards?: string;

  @ApiProperty({
    enum: BoardTexture,
    description: 'Board texture description. Required for post-flop scenarios.',
    example: BoardTexture.DRY,
    required: false,
  })
  @IsRequiredIfPostFlop()
  @IsOptional()
  @IsEnum(BoardTexture)
  boardTexture?: BoardTexture;

  @ApiProperty({
    enum: Difficulty,
    description: 'Difficulty level',
    example: Difficulty.BEGINNER,
  })
  @IsEnum(Difficulty)
  @IsNotEmpty()
  difficulty: Difficulty;

  @ApiProperty({
    enum: Category,
    description: 'Category of the scenario',
    example: Category.OPENING_RANGES,
  })
  @IsEnum(Category)
  @IsNotEmpty()
  category: Category;

  @ApiProperty({
    type: [String],
    description: 'Tags for filtering and organization',
    example: ['tournament', '6max', 'preflop'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  tags: string[];
}
