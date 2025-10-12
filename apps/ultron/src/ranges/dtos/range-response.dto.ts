import { ApiProperty } from '@nestjs/swagger';
import { HandRangeDto } from './hand-range.dto';

export class RangeResponseDto {
  @ApiProperty({
    description: 'The unique MongoDB identifier of the range',
    example: '507f1f77bcf86cd799439011',
  })
  _id: string;

  @ApiProperty({
    description: 'The name of the range',
    example: 'UTG Opening Range',
  })
  name: string;

  @ApiProperty({
    type: [HandRangeDto],
    description: 'Array of hand ranges with actions',
  })
  handsRange: HandRangeDto[];

  @ApiProperty({
    description: 'The user ID who owns this range',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId: string;
}
