import { ApiProperty } from '@nestjs/swagger';
import { RangeResponseDto } from '../../ranges/dtos/range-response.dto';

class SolveParametersDto {
  @ApiProperty({
    description: 'Number of solver iterations',
    example: 200,
  })
  iterations: number;

  @ApiProperty({
    description: 'Solver accuracy threshold',
    example: '0.5',
  })
  accuracy: string;

  @ApiProperty({
    description: 'Rake structure (optional)',
    example: 'No rake',
    required: false,
  })
  rakeStructure?: string;
}

export class ReferenceRangeResponseDto {
  @ApiProperty({
    description: 'The unique MongoDB identifier of the reference range',
    example: '507f1f77bcf86cd799439011',
  })
  _id: string;

  @ApiProperty({
    description: 'The scenario ID this reference range belongs to',
    example: '507f1f77bcf86cd799439012',
  })
  scenarioId: string;

  @ApiProperty({
    type: RangeResponseDto,
    description: 'The GTO solution range data',
  })
  rangeData: RangeResponseDto;

  @ApiProperty({
    description: 'The solver used to generate this range',
    example: 'TexasSolver',
  })
  solver: string;

  @ApiProperty({
    description: 'The version of the solver',
    example: 'v1.0.1',
  })
  solverVersion: string;

  @ApiProperty({
    description: 'When this range was solved',
    example: '2025-01-15T10:30:00.000Z',
  })
  solveDate: string;

  @ApiProperty({
    type: SolveParametersDto,
    description: 'Solver parameters used',
    required: false,
  })
  solveParameters?: SolveParametersDto;

  @ApiProperty({
    description: 'Exploitability score (Nash distance)',
    example: 0.01,
    required: false,
  })
  exploitability?: number;

  @ApiProperty({
    description: 'Whether this range has been manually verified',
    example: false,
  })
  verified: boolean;

  @ApiProperty({
    description: 'When this reference range was created',
    example: '2025-01-15T10:30:00.000Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'When this reference range was last updated',
    example: '2025-01-15T10:30:00.000Z',
  })
  updatedAt: string;
}
