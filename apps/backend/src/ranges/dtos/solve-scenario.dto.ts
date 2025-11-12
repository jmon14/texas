import { IsEnum, IsNotEmpty, IsNumber, IsString, Min, IsOptional, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PlayerPosition } from '../enums/player-position.enum';

export class SolveScenarioDto {
  @ApiProperty({
    description: 'The name of the scenario',
    example: 'UTG Open - 100bb Tournament',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Effective stack depth in big blinds',
    example: 100,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  effectiveStack: number;

  @ApiProperty({
    description: 'Pot size in big blinds (typically 1.5 for preflop: SB + BB)',
    example: 1.5,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  pot: number;

  @ApiProperty({
    description: "In-position player's range (comma-separated poker notation)",
    example: 'AA,KK,QQ,JJ,TT,AKs,AKo',
  })
  @IsString()
  @IsNotEmpty()
  rangeIp: string;

  @ApiProperty({
    description: "Out-of-position player's range (comma-separated poker notation)",
    example: 'AA,KK,QQ,JJ,TT,99,88,AKs,AKo',
  })
  @IsString()
  @IsNotEmpty()
  rangeOop: string;

  @ApiProperty({
    enum: PlayerPosition,
    description: "Which player's strategy to extract",
    example: PlayerPosition.IP,
  })
  @IsEnum(PlayerPosition)
  @IsNotEmpty()
  playerPosition: PlayerPosition;

  @ApiProperty({
    description:
      'Board cards in format "As Kh 7d" (3 cards for flop, 4 for turn, 5 for river). ' +
      'Optional - omit for preflop scenarios.',
    example: 'As Kh 7d',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^([A2-9TJQK][hscd]\s?){3,5}$/, {
    message: 'boardCards must be in format "As Kh 7d" with 3-5 cards',
  })
  boardCards?: string;
}
