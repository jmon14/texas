import { IsEnum, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
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
}
