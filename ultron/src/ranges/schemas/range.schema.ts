import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { HandRange, HandRangeSchema } from './hand-range.schema';

export type RangeDocument = Range & Document;

@Schema({
  collection: 'ranges',
  timestamps: true,
  toJSON: {
    transform: function (_doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      delete ret._class; // Remove Java class reference if present
      // Map MongoDB field names to API field names in response
      if (ret.hands_range) {
        ret.handsRange = ret.hands_range;
        delete ret.hands_range;
      }
      if (ret.user_id) {
        ret.userId = ret.user_id;
        delete ret.user_id;
      }
      return ret;
    },
  },
})
export class Range {
  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  name: string;

  @Prop({
    type: [HandRangeSchema],
    required: true,
  })
  handsRange: HandRange[];

  @Prop({
    type: String,
    required: true,
  })
  userId: string;
}

export const RangeSchema = SchemaFactory.createForClass(Range);

// Map the MongoDB field names to match Vision service
RangeSchema.alias('handsRange', 'hands_range');
RangeSchema.alias('userId', 'user_id');
