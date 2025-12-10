import { ApiProperty } from '@nestjs/swagger';
import { ActionDto } from '../../ranges/dtos/action.dto';
import { ActionType } from '../../ranges/enums/action-type.enum';

export class CorrectHandDto {
  @ApiProperty({
    description: 'The hand label',
    example: 'AA',
  })
  hand: string;

  @ApiProperty({
    type: [ActionDto],
    description: 'User actions for this hand',
  })
  userAction: ActionDto[];

  @ApiProperty({
    type: [ActionDto],
    description: 'GTO actions for this hand',
  })
  gtoAction: ActionDto[];
}

export class MissingHandDto {
  @ApiProperty({
    description: 'The hand label',
    example: 'KK',
  })
  hand: string;

  @ApiProperty({
    type: [ActionDto],
    description: 'GTO actions for this hand',
  })
  gtoAction: ActionDto[];

  @ApiProperty({
    description: 'Reason why this hand is missing',
    example: 'Included in GTO range',
  })
  reason: string;
}

export class ExtraHandDto {
  @ApiProperty({
    description: 'The hand label',
    example: '72o',
  })
  hand: string;

  @ApiProperty({
    type: [ActionDto],
    description: 'User actions for this hand',
  })
  userAction: ActionDto[];

  @ApiProperty({
    description: 'Reason why this hand is extra',
    example: 'Not in GTO range',
  })
  reason: string;
}

export class FrequencyErrorActionDifferenceDto {
  @ApiProperty({
    description: 'The action type',
    enum: ActionType,
  })
  type: ActionType;

  @ApiProperty({
    description: 'User frequency for this action type',
    example: 75,
  })
  userFrequency: number;

  @ApiProperty({
    description: 'GTO frequency for this action type',
    example: 100,
  })
  gtoFrequency: number;

  @ApiProperty({
    description: 'Absolute frequency difference for this action type',
    example: 25,
  })
  difference: number;
}

export class FrequencyErrorHandDto {
  @ApiProperty({
    description: 'The hand label',
    example: 'QQ',
  })
  hand: string;

  @ApiProperty({
    type: [ActionDto],
    description: 'User actions for this hand',
  })
  userAction: ActionDto[];

  @ApiProperty({
    type: [ActionDto],
    description: 'GTO actions for this hand',
  })
  gtoAction: ActionDto[];

  @ApiProperty({
    description: 'Maximum absolute frequency difference across actions',
    example: 25,
  })
  maxDifference: number;

  @ApiProperty({
    type: [FrequencyErrorActionDifferenceDto],
    description: 'Per-action frequency differences',
  })
  actions: FrequencyErrorActionDifferenceDto[];
}

export class ComparisonResultDto {
  @ApiProperty({
    description: 'The attempt ID',
    example: '507f1f77bcf86cd799439013',
  })
  attemptId: string;

  @ApiProperty({
    description: 'The attempt number for this user/scenario',
    example: 1,
  })
  attemptNumber: number;

  @ApiProperty({
    description: 'Accuracy score (0-100)',
    example: 85.5,
    minimum: 0,
    maximum: 100,
  })
  accuracyScore: number;

  @ApiProperty({
    type: [CorrectHandDto],
    description: 'Hands that match GTO within frequency threshold',
  })
  correct: CorrectHandDto[];

  @ApiProperty({
    type: [MissingHandDto],
    description: 'Hands in GTO range but not in user range',
  })
  missing: MissingHandDto[];

  @ApiProperty({
    type: [ExtraHandDto],
    description: 'Hands in user range but not in GTO range',
  })
  extra: ExtraHandDto[];

  @ApiProperty({
    type: [FrequencyErrorHandDto],
    description: 'Hands with frequency differences exceeding threshold (per-action breakdown)',
  })
  frequencyError: FrequencyErrorHandDto[];

  @ApiProperty({
    description: 'Overall feedback summary',
    example:
      'You matched 15 out of 20 hands correctly (75.0%). Missing 3 hands that should be included.',
  })
  overallFeedback: string;
}
