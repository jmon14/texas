import {
  Controller,
  Get,
  Post,
  Param,
  NotFoundException,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { ReferenceRangesService } from './reference-ranges.service';
import { ReferenceRangesImportService } from './reference-ranges-import.service';
import { ReferenceRangeResponseDto } from './dtos/reference-range-response.dto';
import JwtAuthGuard from '../auth/guards/jwt-auth.guard';

@ApiTags('reference-ranges')
@Controller('reference-ranges')
export class ReferenceRangesController {
  constructor(
    private readonly referenceRangesService: ReferenceRangesService,
    private readonly referenceRangesImportService: ReferenceRangesImportService,
  ) {}

  @Get('scenario/:scenarioId')
  @ApiOperation({
    summary: 'Get reference range for a scenario',
    description:
      'Returns the GTO-solved reference range for a specific scenario. ' +
      'This is a public endpoint (no authentication required) as reference ranges ' +
      'are read-only GTO solutions. Supports both preflop and post-flop scenarios.',
  })
  @ApiParam({
    name: 'scenarioId',
    description: 'The ID of the scenario',
    example: '507f1f77bcf86cd799439012',
  })
  @ApiResponse({
    status: 200,
    description: 'Reference range found',
    type: ReferenceRangeResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Scenario or reference range not found',
  })
  async getByScenarioId(
    @Param('scenarioId') scenarioId: string,
  ): Promise<ReferenceRangeResponseDto> {
    const referenceRange = await this.referenceRangesService.findByScenarioId(scenarioId);

    if (!referenceRange) {
      throw new NotFoundException(`Reference range not found for scenario with ID ${scenarioId}`);
    }

    return referenceRange.toObject();
  }

  @Post('scenario/:scenarioId/import')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Import reference range for a scenario',
    description:
      'Solves and imports a reference range for a specific scenario. ' +
      'Uses TexasSolver to compute GTO solution. Supports both preflop and post-flop scenarios. ' +
      'Requires authentication.',
  })
  @ApiParam({
    name: 'scenarioId',
    description: 'The ID of the scenario to import',
    example: '507f1f77bcf86cd799439012',
  })
  @ApiResponse({
    status: 201,
    description: 'Reference range imported successfully',
    type: ReferenceRangeResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Scenario not found',
  })
  async importForScenario(
    @Param('scenarioId') scenarioId: string,
  ): Promise<ReferenceRangeResponseDto> {
    const referenceRange = await this.referenceRangesImportService.importForScenario(scenarioId);
    return referenceRange.toObject();
  }

  @Post('import-all')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Import reference ranges for all scenarios',
    description:
      'Batch import: solves and imports reference ranges for all scenarios ' +
      'in the database. Uses TexasSolver to compute GTO solutions. ' +
      'Supports both preflop and post-flop scenarios. Requires authentication.',
  })
  @ApiResponse({
    status: 201,
    description: 'Reference ranges imported successfully',
    type: [ReferenceRangeResponseDto],
  })
  async importAllScenarios(): Promise<ReferenceRangeResponseDto[]> {
    const referenceRanges = await this.referenceRangesImportService.importAllScenarios();
    return referenceRanges.map((refRange) => refRange.toObject());
  }
}
