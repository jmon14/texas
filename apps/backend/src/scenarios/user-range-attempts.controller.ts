import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Request,
  UseGuards,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import JwtAuthGuard from '../auth/guards/jwt-auth.guard';
import { PayloadRequest } from '../auth/interfaces/request.interface';
import { RangeComparisonService } from './range-comparison.service';
import { UserRangeAttemptsService } from './user-range-attempts.service';
import { RangesService } from '../ranges/ranges.service';
import { CompareRangesDto } from './dtos/compare-ranges.dto';
import { ComparisonResultDto } from './dtos/comparison-result.dto';
import { UserRangeAttemptResponseDto } from './dtos/user-range-attempt-response.dto';
import { ComparisonResult } from './interfaces/comparison-result.interface';
import { UserRangeAttemptDocument } from './schemas/user-range-attempt.schema';

@Controller('user-range-attempts')
@ApiTags('user-range-attempts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class UserRangeAttemptsController {
  constructor(
    private readonly rangeComparisonService: RangeComparisonService,
    private readonly userRangeAttemptsService: UserRangeAttemptsService,
    private readonly rangesService: RangesService,
  ) {}

  @Post('compare')
  @ApiOperation({
    summary: 'Compare user range to GTO reference range',
    description:
      'Compares a user range against the GTO reference range for a scenario and saves the attempt.',
  })
  @ApiResponse({
    status: 200,
    description: 'Comparison completed successfully.',
    type: ComparisonResultDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Scenario, range, or reference range not found.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. JWT token required.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. User does not own the range.',
  })
  async compareRanges(
    @Body() compareRangesDto: CompareRangesDto,
    @Request() { user }: PayloadRequest,
  ): Promise<ComparisonResultDto> {
    const userId = user.uuid;
    const { scenarioId, userRangeId } = compareRangesDto;

    // Verify user owns the range
    const userRange = await this.rangesService.getRangeById(userRangeId);
    if (!userRange) {
      throw new NotFoundException(`Range with ID ${userRangeId} not found`);
    }
    if (userRange.userId !== userId) {
      throw new NotFoundException(`Range with ID ${userRangeId} not found`);
    }

    // Perform comparison
    const comparisonResult: ComparisonResult = await this.rangeComparisonService.compareRanges(
      scenarioId,
      userRangeId,
    );

    // Save attempt
    const attempt = await this.userRangeAttemptsService.createAttempt(
      userId,
      scenarioId,
      userRangeId,
      comparisonResult,
    );

    // Transform to response DTO
    return this.transformToComparisonResultDto(
      attempt._id.toString(),
      attempt.attemptNumber,
      comparisonResult,
    );
  }

  @Get('user/:userId/scenario/:scenarioId')
  @ApiOperation({
    summary: 'Get attempt history for a user and scenario',
    description:
      'Retrieves all attempts for a specific user and scenario, sorted by attempt number.',
  })
  @ApiParam({
    name: 'userId',
    description: 'The user ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiParam({
    name: 'scenarioId',
    description: 'The scenario ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Attempt history retrieved successfully.',
    type: [UserRangeAttemptResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. JWT token required.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. User can only access their own attempts.',
  })
  async getAttemptHistory(
    @Param('userId') userId: string,
    @Param('scenarioId') scenarioId: string,
    @Request() { user }: PayloadRequest,
  ): Promise<UserRangeAttemptResponseDto[]> {
    const authenticatedUserId = user.uuid;

    // Verify authenticated user matches route userId
    if (authenticatedUserId !== userId) {
      throw new ForbiddenException('You can only access your own attempts');
    }

    // Retrieve attempts
    const attempts = await this.userRangeAttemptsService.findByUserAndScenario(userId, scenarioId);

    // Transform to response DTOs
    return attempts.map((attempt) => this.transformToUserRangeAttemptResponseDto(attempt));
  }

  /**
   * Transform ComparisonResult interface to ComparisonResultDto
   */
  private transformToComparisonResultDto(
    attemptId: string,
    attemptNumber: number,
    result: ComparisonResult,
  ): ComparisonResultDto {
    return {
      attemptId,
      attemptNumber,
      accuracyScore: result.accuracyScore,
      correct: result.handsByCategory.correct.map((hand) => ({
        hand: hand.hand,
        userAction: hand.userAction,
        gtoAction: hand.gtoAction,
      })),
      missing: result.handsByCategory.missing.map((hand) => ({
        hand: hand.hand,
        gtoAction: hand.gtoAction,
        reason: hand.reason,
      })),
      extra: result.handsByCategory.extra.map((hand) => ({
        hand: hand.hand,
        userAction: hand.userAction,
        reason: hand.reason,
      })),
      frequencyError: result.handsByCategory.frequencyError.map((hand) => ({
        hand: hand.hand,
        userAction: hand.userAction,
        gtoAction: hand.gtoAction,
        maxDifference: hand.maxDifference,
        actions: hand.actions,
      })),
      overallFeedback: result.overallFeedback,
    };
  }

  /**
   * Transform UserRangeAttemptDocument to UserRangeAttemptResponseDto
   */
  private transformToUserRangeAttemptResponseDto(
    attempt: UserRangeAttemptDocument,
  ): UserRangeAttemptResponseDto {
    // Mongoose timestamps are added automatically but not in TypeScript types
    const attemptWithTimestamps = attempt as UserRangeAttemptDocument & {
      createdAt?: Date;
      updatedAt?: Date;
    };

    return {
      _id: attempt._id.toString(),
      userId: attempt.userId,
      scenarioId: attempt.scenarioId.toString(),
      rangeId: attempt.rangeId.toString(),
      comparisonResult: {
        accuracyScore: attempt.comparisonResult.accuracyScore,
        missingHands: attempt.comparisonResult.missingHands,
        extraHands: attempt.comparisonResult.extraHands,
        frequencyErrors: attempt.comparisonResult.frequencyErrors.map((error) => ({
          hand: error.hand,
          maxDifference: error.maxDifference,
          actions: (error.actions || []).map((action) => ({
            type: action.type,
            userFrequency: action.userFrequency,
            gtoFrequency: action.gtoFrequency,
            difference: action.difference,
          })),
        })),
      },
      attemptNumber: attempt.attemptNumber,
      createdAt: attemptWithTimestamps.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: attemptWithTimestamps.updatedAt?.toISOString() || new Date().toISOString(),
    };
  }
}
