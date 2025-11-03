import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Position } from '../enums/position.enum';
import { PreviousAction, PreviousActionSchema } from './previous-action.schema';

export type ScenarioDocument = Scenario & Document;

@Schema({
  collection: 'scenarios',
  timestamps: true,
  toObject: {
    transform: (_, ret) => {
      ret._id = ret._id.toString();
      return ret;
    },
  },
})
export class Scenario {
  @Prop({
    type: String,
    required: true,
  })
  name: string;

  @Prop({
    type: String,
    required: true,
  })
  description: string;

  // Scenario Context
  @Prop({
    type: String,
    enum: ['preflop', 'flop', 'turn', 'river'],
    required: true,
  })
  street: 'preflop' | 'flop' | 'turn' | 'river';

  @Prop({
    type: String,
    enum: ['cash', 'tournament'],
    required: true,
  })
  gameType: 'cash' | 'tournament';

  @Prop({
    type: String,
    enum: Object.values(Position),
    required: true,
  })
  position: Position; // Hero position (MVP: heads-up only)

  @Prop({
    type: String,
    enum: Object.values(Position),
    required: true,
  })
  vsPosition: Position; // Villain position (MVP: heads-up only)

  @Prop({
    type: String,
    required: true,
  })
  actionType: string; // "vs_open_call" | "vs_open_3bet" | "open" | "vs_3bet" | "vs_4bet"

  // Stack & Sizing (Fixed for MVP)
  @Prop({
    type: Number,
    required: true,
  })
  effectiveStack: number; // Big blinds (e.g., 100)

  @Prop({
    type: Number,
    required: true,
  })
  betSize: number; // Big blinds (e.g., 2.5)

  // Optional Context
  @Prop({
    type: [PreviousActionSchema],
    required: false,
  })
  previousActions?: PreviousAction[]; // Structured action history

  @Prop({
    type: String,
    required: false,
  })
  boardTexture?: string; // Text description for post-flop scenarios (post-MVP)

  // Metadata
  @Prop({
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true,
  })
  difficulty: 'beginner' | 'intermediate' | 'advanced';

  @Prop({
    type: String,
    required: true,
  })
  category: string; // "Opening Ranges", "3-Betting", "Defending BB", etc.

  @Prop({
    type: [String],
    required: true,
    default: [],
  })
  tags: string[]; // ["tournament", "6max", "preflop", "positional"]
}

export const ScenarioSchema = SchemaFactory.createForClass(Scenario);
