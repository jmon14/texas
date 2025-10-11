import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Action, ActionSchema } from './action.schema';

@Schema({
  _id: false,
  toJSON: {
    transform: function (_doc, ret) {
      // Ensure nested actions have lowercase type values
      if (ret.actions && Array.isArray(ret.actions)) {
        ret.actions = ret.actions.map((action: any) => ({
          ...action,
          type: action.type ? action.type.toLowerCase() : action.type,
        }));
      }
      return ret;
    },
  },
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
