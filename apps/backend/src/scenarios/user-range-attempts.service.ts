import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserRangeAttempt, UserRangeAttemptDocument } from './schemas/user-range-attempt.schema';
import { ComparisonResult } from './interfaces/comparison-result.interface';

@Injectable()
export class UserRangeAttemptsService {
  constructor(
    @InjectModel(UserRangeAttempt.name)
    private userRangeAttemptModel: Model<UserRangeAttemptDocument>,
  ) {}

  /**
   * Create a new user range attempt with auto-incrementing attempt number
   */
  async createAttempt(
    userId: string,
    scenarioId: string,
    rangeId: string,
    comparisonResult: ComparisonResult,
  ): Promise<UserRangeAttemptDocument> {
    const attemptNumber = await this.getAttemptNumber(userId, scenarioId);

    const attempt = new this.userRangeAttemptModel({
      userId,
      scenarioId: new Types.ObjectId(scenarioId),
      rangeId: new Types.ObjectId(rangeId),
      comparisonResult: this.transformComparisonResult(comparisonResult),
      attemptNumber,
    });

    return await attempt.save();
  }

  /**
   * Find all attempts for a user and scenario, sorted by attempt number ascending
   */
  async findByUserAndScenario(
    userId: string,
    scenarioId: string,
  ): Promise<UserRangeAttemptDocument[]> {
    return await this.userRangeAttemptModel
      .find({
        userId,
        scenarioId: new Types.ObjectId(scenarioId),
      })
      .sort({ attemptNumber: 1 })
      .exec();
  }

  /**
   * Calculate the next attempt number for a user/scenario combination
   */
  private async getAttemptNumber(userId: string, scenarioId: string): Promise<number> {
    const existingAttempts = await this.userRangeAttemptModel
      .find({
        userId,
        scenarioId: new Types.ObjectId(scenarioId),
      })
      .exec();

    return existingAttempts.length + 1;
  }

  /**
   * Transform ComparisonResult interface to schema-compatible format
   */
  private transformComparisonResult(result: ComparisonResult): {
    accuracyScore: number;
    missingHands: string[];
    extraHands: string[];
    frequencyErrors: {
      hand: string;
      maxDifference: number;
      actions: {
        type: string;
        userFrequency: number;
        gtoFrequency: number;
        difference: number;
      }[];
    }[];
  } {
    // Extract hand labels from missing hands
    const missingHands = result.handsByCategory.missing.map((hand) => hand.hand);

    // Extract hand labels from extra hands
    const extraHands = result.handsByCategory.extra.map((hand) => hand.hand);

    // Transform frequency errors to schema format
    const frequencyErrors = result.handsByCategory.frequencyError.map((error) => ({
      hand: error.hand,
      maxDifference: error.maxDifference,
      actions: error.actions.map((action) => ({
        type: action.type,
        userFrequency: action.userFrequency,
        gtoFrequency: action.gtoFrequency,
        difference: action.difference,
      })),
    }));

    return {
      accuracyScore: result.accuracyScore,
      missingHands,
      extraHands,
      frequencyErrors,
    };
  }
}
