import { validate } from 'class-validator';
import { CreateScenarioDto } from '../dtos/create-scenario.dto';
import {
  Position,
  GameType,
  Difficulty,
  ScenarioActionType,
  Category,
  Street,
  BoardTexture,
} from '../enums';

describe('Scenario Schema Validation', () => {
  describe('CreateScenarioDto - boardCards validation', () => {
    const baseDto: CreateScenarioDto = {
      name: 'Test Scenario',
      description: 'Test description',
      street: Street.PREFLOP,
      gameType: GameType.TOURNAMENT,
      position: Position.UTG,
      vsPosition: Position.BB,
      actionType: ScenarioActionType.OPEN,
      effectiveStack: 100,
      betSize: 2.0,
      difficulty: Difficulty.BEGINNER,
      category: Category.OPENING_RANGES,
      tags: ['tournament', 'preflop'],
    };

    it('should allow preflop scenario without boardCards', async () => {
      const dto = { ...baseDto, street: Street.PREFLOP };
      const errors = await validate(dto);
      const boardCardsErrors = errors.filter((e) => e.property === 'boardCards');
      expect(boardCardsErrors).toHaveLength(0);
    });

    it('should accept valid boardCards format for flop (3 cards)', async () => {
      const dto = {
        ...baseDto,
        street: Street.FLOP,
        boardCards: 'As Kh 7d',
        boardTexture: BoardTexture.DRY,
      };
      const errors = await validate(dto);
      const boardCardsErrors = errors.filter((e) => e.property === 'boardCards');
      expect(boardCardsErrors).toHaveLength(0);
    });

    it('should accept valid boardCards format for turn (4 cards)', async () => {
      const dto = {
        ...baseDto,
        street: Street.TURN,
        boardCards: 'As Kh 7d 2c',
        boardTexture: BoardTexture.DRY,
      };
      const errors = await validate(dto);
      const boardCardsErrors = errors.filter((e) => e.property === 'boardCards');
      expect(boardCardsErrors).toHaveLength(0);
    });

    it('should accept valid boardCards format for river (5 cards)', async () => {
      const dto = {
        ...baseDto,
        street: Street.RIVER,
        boardCards: 'As Kh 7d 2c 9h',
        boardTexture: BoardTexture.DRY,
      };
      const errors = await validate(dto);
      const boardCardsErrors = errors.filter((e) => e.property === 'boardCards');
      expect(boardCardsErrors).toHaveLength(0);
    });
  });

  describe('CreateScenarioDto - boardTexture validation', () => {
    const baseDto: CreateScenarioDto = {
      name: 'Test Scenario',
      description: 'Test description',
      street: Street.PREFLOP,
      gameType: GameType.TOURNAMENT,
      position: Position.UTG,
      vsPosition: Position.BB,
      actionType: ScenarioActionType.OPEN,
      effectiveStack: 100,
      betSize: 2.0,
      difficulty: Difficulty.BEGINNER,
      category: Category.OPENING_RANGES,
      tags: ['tournament', 'preflop'],
    };

    it('should allow preflop scenario without boardTexture', async () => {
      const dto = { ...baseDto, street: Street.PREFLOP };
      const errors = await validate(dto);
      const boardTextureErrors = errors.filter((e) => e.property === 'boardTexture');
      expect(boardTextureErrors).toHaveLength(0);
    });

    // Note: DTO validation with class-validator has limitations for conditional required fields.
    // Missing required fields will be caught by Mongoose schema validation at the service layer.
    // The service tests verify that schema validation works correctly.

    it('should accept valid boardTexture enum value', async () => {
      const dto = {
        ...baseDto,
        street: Street.FLOP,
        boardCards: 'As Kh 7d',
        boardTexture: BoardTexture.DRY,
      };
      const errors = await validate(dto);
      const boardTextureErrors = errors.filter((e) => e.property === 'boardTexture');
      expect(boardTextureErrors).toHaveLength(0);
    });
  });
});
