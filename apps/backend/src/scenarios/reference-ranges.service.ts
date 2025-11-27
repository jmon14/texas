import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ReferenceRange, ReferenceRangeDocument } from './schemas/reference-range.schema';
import { Range } from '../ranges/schemas/range.schema';
import { ScenariosService } from './scenarios.service';

@Injectable()
export class ReferenceRangesService {
  constructor(
    @InjectModel(ReferenceRange.name)
    private referenceRangeModel: Model<ReferenceRangeDocument>,
    private scenariosService: ScenariosService,
  ) {}

  /**
   * Find reference range by scenario ID
   */
  async findByScenarioId(scenarioId: string): Promise<ReferenceRangeDocument | null> {
    return await this.referenceRangeModel
      .findOne({ scenarioId: new Types.ObjectId(scenarioId) })
      .exec();
  }

  /**
   * Create or update reference range (idempotent)
   */
  async createOrUpdate(
    scenarioId: string,
    solvedRange: Range,
    solverMetadata: {
      solver: string;
      solverVersion: string;
      solveParameters?: {
        iterations: number;
        accuracy: string;
      };
    },
  ): Promise<ReferenceRangeDocument> {
    // Validate scenario exists
    await this.scenariosService.findById(scenarioId);

    const existing = await this.findByScenarioId(scenarioId);

    if (existing) {
      // Update existing reference range
      existing.rangeData = solvedRange;
      existing.solver = solverMetadata.solver;
      existing.solverVersion = solverMetadata.solverVersion;
      existing.solveDate = new Date();
      existing.solveParameters = solverMetadata.solveParameters;
      return await existing.save();
    } else {
      // Create new reference range
      const referenceRange = new this.referenceRangeModel({
        scenarioId: new Types.ObjectId(scenarioId),
        rangeData: solvedRange,
        solver: solverMetadata.solver,
        solverVersion: solverMetadata.solverVersion,
        solveDate: new Date(),
        solveParameters: solverMetadata.solveParameters,
        verified: false,
      });

      return await referenceRange.save();
    }
  }
}
