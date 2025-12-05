import { ApiProperty } from '@nestjs/swagger';

export class FrequencyErrorDto {
  @ApiProperty({
    description: 'The hand label',
    example: 'QQ',
  })
  hand: string;

  @ApiProperty({
    description: 'User frequency',
    example: 75,
  })
  userFrequency: number;

  @ApiProperty({
    description: 'GTO frequency',
    example: 100,
  })
  gtoFrequency: number;

  @ApiProperty({
    description: 'Frequency difference',
    example: 25,
  })
  difference: number;
}

export class UserRangeAttemptComparisonResultDto {
  @ApiProperty({
    description: 'Accuracy score (0-100)',
    example: 85.5,
  })
  accuracyScore: number;

  @ApiProperty({
    type: [String],
    description: 'Hands missing from user range',
    example: ['KK', 'AKs'],
  })
  missingHands: string[];

  @ApiProperty({
    type: [String],
    description: 'Hands extra in user range',
    example: ['72o'],
  })
  extraHands: string[];

  @ApiProperty({
    type: [FrequencyErrorDto],
    description: 'Frequency errors',
  })
  frequencyErrors: FrequencyErrorDto[];
}

export class UserRangeAttemptResponseDto {
  @ApiProperty({
    description: 'The unique MongoDB identifier',
    example: '507f1f77bcf86cd799439013',
  })
  _id: string;

  @ApiProperty({
    description: 'The user ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId: string;

  @ApiProperty({
    description: 'The scenario ID',
    example: '507f1f77bcf86cd799439011',
  })
  scenarioId: string;

  @ApiProperty({
    description: 'The range ID',
    example: '507f1f77bcf86cd799439012',
  })
  rangeId: string;

  @ApiProperty({
    type: UserRangeAttemptComparisonResultDto,
    description: 'Comparison results',
  })
  comparisonResult: UserRangeAttemptComparisonResultDto;

  @ApiProperty({
    description: 'The attempt number',
    example: 1,
  })
  attemptNumber: number;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2025-01-15T10:30:00.000Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2025-01-15T10:30:00.000Z',
  })
  updatedAt: string;
}
