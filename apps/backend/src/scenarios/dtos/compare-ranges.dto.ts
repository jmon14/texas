import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CompareRangesDto {
  @ApiProperty({
    description: 'The scenario ID to compare against',
    example: '507f1f77bcf86cd799439011',
  })
  @IsString()
  @IsNotEmpty()
  scenarioId: string;

  @ApiProperty({
    description: 'The user range ID to compare',
    example: '507f1f77bcf86cd799439012',
  })
  @IsString()
  @IsNotEmpty()
  userRangeId: string;
}
