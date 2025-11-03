import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ActionType } from '../enums/action-type.enum';

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
  frequency: number; // Frequency (0-100) - renamed from percentage

  // GTO Solver Data (from TexasSolver export)
  // Optional - NOT part of MVP
  @Prop({
    type: Number,
    required: false,
  })
  ev?: number; // Expected value (in big blinds)

  @Prop({
    type: Number,
    required: false,
  })
  equity?: number; // Equity vs opponent's range (0-100)
}

export const ActionSchema = SchemaFactory.createForClass(Action);
