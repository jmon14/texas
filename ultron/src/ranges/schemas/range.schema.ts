import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { HandRange, HandRangeSchema } from './hand-range.schema';

export type RangeDocument = Range & Document;

@Schema({
  collection: 'ranges',
  timestamps: true,
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
