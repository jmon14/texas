import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Position } from '../enums/position.enum';
import { ActionType } from '../enums/action-type.enum';

/**
 * PreviousAction Schema
 * Represents actions taken before the current decision point
 */
@Schema({
  _id: false,
})
export class PreviousAction {
  @Prop({
    type: String,
    enum: Object.values(Position),
    required: true,
  })
  position: Position;

  @Prop({
    type: String,
    enum: Object.values(ActionType),
    required: true,
  })
  actionType: ActionType;

  @Prop({
    type: Number,
    required: false,
  })
  sizing?: number; // Bet/raise size in big blinds (required for raises)
}

export const PreviousActionSchema = SchemaFactory.createForClass(PreviousAction);
