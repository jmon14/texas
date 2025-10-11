import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ActionType } from './action-type.enum';

@Schema({
  _id: false,
  toJSON: {
    transform: function (_doc, ret) {
      // Ensure action type is serialized as lowercase string value
      if (ret.type && typeof ret.type === 'string') {
        ret.type = ret.type.toLowerCase();
      }
      return ret;
    },
  },
})
export class Action {
  @Prop({
    type: String,
    enum: Object.values(ActionType),
    required: true,
  })
  type: ActionType;

  @Prop({
    type: Number,
    required: true,
  })
  percentage: number;
}

export const ActionSchema = SchemaFactory.createForClass(Action);
