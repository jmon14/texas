import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserRangeAttemptDocument = UserRangeAttempt & Document;

/**
 * ComparisonResult interface for nested comparison data
 */
interface ComparisonResult {
  accuracyScore: number; // 0-100 percentage match
  missingHands: string[]; // Hands they should have included
  extraHands: string[]; // Hands they shouldn't have included
  frequencyErrors: {
    hand: string;
    userFrequency: number;
    gtoFrequency: number;
    difference: number;
  }[];
}

@Schema({
  collection: 'user_range_attempts',
  timestamps: true,
  toObject: {
    transform: (_, ret) => {
      ret._id = ret._id.toString();
      if (ret.scenarioId) {
        ret.scenarioId = ret.scenarioId.toString();
      }
      if (ret.rangeId) {
        ret.rangeId = ret.rangeId.toString();
      }
      return ret;
    },
  },
})
export class UserRangeAttempt {
  @Prop({
    type: String,
    required: true,
  })
  userId: string; // From auth system

  @Prop({
    type: Types.ObjectId,
    ref: 'Scenario',
    required: true,
  })
  scenarioId: Types.ObjectId; // Which scenario they practiced

  @Prop({
    type: Types.ObjectId,
    ref: 'Range',
    required: true,
  })
  rangeId: Types.ObjectId; // Their attempt (links to ranges collection)

  // Comparison Results (cached for history)
  @Prop({
    type: {
      accuracyScore: { type: Number, required: true },
      missingHands: { type: [String], required: true },
      extraHands: { type: [String], required: true },
      frequencyErrors: {
        type: [
          {
            hand: { type: String, required: true },
            userFrequency: { type: Number, required: true },
            gtoFrequency: { type: Number, required: true },
            difference: { type: Number, required: true },
          },
        ],
        required: true,
      },
    },
    required: true,
  })
  comparisonResult: ComparisonResult;

  @Prop({
    type: Number,
    required: true,
  })
  attemptNumber: number; // How many times they've tried this scenario
}

export const UserRangeAttemptSchema = SchemaFactory.createForClass(UserRangeAttempt);
