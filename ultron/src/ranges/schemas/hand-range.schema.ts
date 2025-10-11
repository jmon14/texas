import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Action, ActionSchema } from './action.schema';

@Schema({
  _id: false,
})
export class HandRange {
  @Prop({
    type: Number,
    required: true,
  })
  rangeFraction: number;

  @Prop({
    type: String,
    required: true,
  })
  label: string;

  @Prop({
    type: [ActionSchema],
    required: true,
  })
  actions: Action[];
}

export const HandRangeSchema = SchemaFactory.createForClass(HandRange);
