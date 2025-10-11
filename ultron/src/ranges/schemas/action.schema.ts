import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ActionType } from './action-type.enum';

@Schema({
  _id: false,
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
