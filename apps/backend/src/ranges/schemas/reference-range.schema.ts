import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Range, RangeSchema } from './range.schema';

export type ReferenceRangeDocument = ReferenceRange & Document;

@Schema({
  collection: 'reference_ranges',
  timestamps: true,
  toObject: {
    transform: (doc, ret) => {
      ret._id = ret._id.toString();
      if (ret.scenarioId) {
        ret.scenarioId = ret.scenarioId.toString();
      }
      return ret;
    },
  },
})
export class ReferenceRange {
  @Prop({
    type: Types.ObjectId,
    ref: 'Scenario',
    required: true,
  })
  scenarioId: Types.ObjectId; // Links to Scenario

  @Prop({
    type: RangeSchema,
    required: true,
  })
  rangeData: Range; // Reuses existing Range structure for GTO solution

  // Solver Metadata
  @Prop({
    type: String,
    required: true,
  })
  solver: string; // "TexasSolver"

  @Prop({
    type: String,
    required: true,
  })
  solverVersion: string; // "v1.0.1"

  @Prop({
    type: Date,
    required: true,
  })
  solveDate: Date; // When this was solved

  @Prop({
    type: Object,
    required: false,
  })
  solveParameters?: {
    iterations: number;
    accuracy: string;
    rakeStructure?: string;
  };

  // Quality Indicators
  @Prop({
    type: Number,
    required: false,
  })
  exploitability?: number; // Nash distance (lower = more GTO)

  @Prop({
    type: Boolean,
    required: false,
    default: false,
  })
  verified: boolean; // Manual verification flag
}

export const ReferenceRangeSchema = SchemaFactory.createForClass(ReferenceRange);
