// NestJS
import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException, ConflictException } from '@nestjs/common';

// Services
import { ScenariosService } from '../scenarios.service';

// Schemas
import { Scenario } from '../schemas';
// Enums
import {
  Position,
  GameType,
  Difficulty,
  ScenarioActionType,
  Category,
  Street,
  BoardTexture,
} from '../enums';
import { CreateScenarioDto } from '../dtos';

describe('ScenariosService', () => {
  let scenariosService: ScenariosService;
  let mockScenarioModel: any;

  const mockScenario = {
    _id: '507f1f77bcf86cd799439011',
    name: 'UTG Open - 100bb Tournament',
    description: 'You are UTG in a 100bb tournament. What should your opening range be?',
    street: 'preflop',
    gameType: 'tournament',
    position: Position.UTG,
    vsPosition: Position.BB,
    actionType: ScenarioActionType.OPEN,
    effectiveStack: 100,
    betSize: 2.0,
    difficulty: 'beginner',
    category: Category.OPENING_RANGES,
    tags: ['tournament', '6max', 'preflop'],
    createdAt: new Date(),
    updatedAt: new Date(),
    toObject: jest.fn().mockReturnThis(),
  };

  beforeEach(async () => {
    // Create mock Mongoose model
    mockScenarioModel = jest.fn().mockImplementation(() => ({}));

    // Add static methods to the mock model
    mockScenarioModel.find = jest.fn();
    mockScenarioModel.findById = jest.fn();
    mockScenarioModel.findOne = jest.fn();

    const module = await Test.createTestingModule({
      providers: [
        ScenariosService,
        {
          provide: getModelToken(Scenario.name),
          useValue: mockScenarioModel,
        },
      ],
    }).compile();

    scenariosService = module.get<ScenariosService>(ScenariosService);
  });

  describe('findAll', () => {
    it('should return all scenarios when no filters provided', async () => {
      const mockScenarios = [mockScenario, { ...mockScenario, _id: 'another-id' }];
      const mockExec = jest.fn().mockResolvedValue(mockScenarios);
      mockScenarioModel.find.mockReturnValue({ exec: mockExec });

      const result = await scenariosService.findAll();

      expect(mockScenarioModel.find).toHaveBeenCalledWith({});
      expect(result).toHaveLength(2);
      expect(mockScenario.toObject).toHaveBeenCalled();
    });

    it('should filter by gameType', async () => {
      const mockScenarios = [mockScenario];
      const mockExec = jest.fn().mockResolvedValue(mockScenarios);
      mockScenarioModel.find.mockReturnValue({ exec: mockExec });

      const result = await scenariosService.findAll(GameType.TOURNAMENT);

      expect(mockScenarioModel.find).toHaveBeenCalledWith({ gameType: GameType.TOURNAMENT });
      expect(result).toHaveLength(1);
    });

    it('should filter by difficulty', async () => {
      const mockScenarios = [mockScenario];
      const mockExec = jest.fn().mockResolvedValue(mockScenarios);
      mockScenarioModel.find.mockReturnValue({ exec: mockExec });

      const result = await scenariosService.findAll(undefined, Difficulty.BEGINNER);

      expect(mockScenarioModel.find).toHaveBeenCalledWith({ difficulty: Difficulty.BEGINNER });
      expect(result).toHaveLength(1);
    });

    it('should filter by category', async () => {
      const mockScenarios = [mockScenario];
      const mockExec = jest.fn().mockResolvedValue(mockScenarios);
      mockScenarioModel.find.mockReturnValue({ exec: mockExec });

      const result = await scenariosService.findAll(undefined, undefined, Category.OPENING_RANGES);

      expect(mockScenarioModel.find).toHaveBeenCalledWith({ category: Category.OPENING_RANGES });
      expect(result).toHaveLength(1);
    });

    it('should combine multiple filters', async () => {
      const mockScenarios = [mockScenario];
      const mockExec = jest.fn().mockResolvedValue(mockScenarios);
      mockScenarioModel.find.mockReturnValue({ exec: mockExec });

      const result = await scenariosService.findAll(
        GameType.TOURNAMENT,
        Difficulty.BEGINNER,
        Category.OPENING_RANGES,
      );

      expect(mockScenarioModel.find).toHaveBeenCalledWith({
        gameType: GameType.TOURNAMENT,
        difficulty: Difficulty.BEGINNER,
        category: Category.OPENING_RANGES,
      });
      expect(result).toHaveLength(1);
    });

    it('should return empty array when no scenarios match filters', async () => {
      const mockExec = jest.fn().mockResolvedValue([]);
      mockScenarioModel.find.mockReturnValue({ exec: mockExec });

      const result = await scenariosService.findAll(GameType.CASH);

      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should return a scenario by id', async () => {
      const mockDoc = {
        ...mockScenario,
        toObject: jest.fn().mockReturnValue(mockScenario),
      };
      const mockExec = jest.fn().mockResolvedValue(mockDoc);
      mockScenarioModel.findById.mockReturnValue({ exec: mockExec });

      const result = await scenariosService.findById('507f1f77bcf86cd799439011');

      expect(mockScenarioModel.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(result).toEqual(mockScenario);
    });

    it('should throw NotFoundException when scenario not found', async () => {
      const mockExec = jest.fn().mockResolvedValue(null);
      mockScenarioModel.findById.mockReturnValue({ exec: mockExec });

      await expect(scenariosService.findById('non-existent-id')).rejects.toThrow(NotFoundException);
      await expect(scenariosService.findById('non-existent-id')).rejects.toThrow(
        'Scenario with ID non-existent-id not found',
      );
    });
  });

  describe('findByCategory', () => {
    it('should return scenarios for specific category', async () => {
      const mockScenarios = [mockScenario];
      const mockExec = jest.fn().mockResolvedValue(mockScenarios);
      mockScenarioModel.find.mockReturnValue({ exec: mockExec });

      const result = await scenariosService.findByCategory(Category.OPENING_RANGES);

      expect(mockScenarioModel.find).toHaveBeenCalledWith({ category: Category.OPENING_RANGES });
      expect(result).toHaveLength(1);
    });

    it('should return empty array when no scenarios match category', async () => {
      const mockExec = jest.fn().mockResolvedValue([]);
      mockScenarioModel.find.mockReturnValue({ exec: mockExec });

      // Test with a valid enum value that doesn't exist in mock data
      const result = await scenariosService.findByCategory(Category.DEFENDING_BB);

      expect(mockScenarioModel.find).toHaveBeenCalledWith({ category: Category.DEFENDING_BB });
      expect(result).toEqual([]);
    });
  });

  describe('create', () => {
    const createScenarioDto: CreateScenarioDto = {
      name: 'UTG Open - 100bb Tournament',
      description: 'You are UTG in a 100bb tournament. What should your opening range be?',
      street: Street.PREFLOP,
      gameType: GameType.TOURNAMENT,
      position: Position.UTG,
      vsPosition: Position.BB,
      actionType: ScenarioActionType.OPEN,
      effectiveStack: 100,
      betSize: 2.0,
      difficulty: Difficulty.BEGINNER,
      category: Category.OPENING_RANGES,
      tags: ['tournament', '6max', 'preflop'],
    };

    it('should create a new scenario', async () => {
      const mockExec = jest.fn().mockResolvedValue(null); // No existing scenario
      mockScenarioModel.findOne.mockReturnValue({ exec: mockExec });

      const mockSave = jest.fn().mockResolvedValue({
        ...mockScenario,
        toObject: jest.fn().mockReturnValue(mockScenario),
      });

      const mockInstance = {
        save: mockSave,
      };
      mockScenarioModel.mockReturnValue(mockInstance);

      const result = await scenariosService.create(createScenarioDto);

      expect(mockScenarioModel.findOne).toHaveBeenCalledWith({ name: createScenarioDto.name });
      expect(mockScenarioModel).toHaveBeenCalledWith(createScenarioDto);
      expect(mockSave).toHaveBeenCalled();
      expect(result).toEqual(mockScenario);
    });

    it('should throw ConflictException when scenario with same name exists', async () => {
      const existingScenario = {
        ...mockScenario,
        name: createScenarioDto.name,
      };
      const mockExec = jest.fn().mockResolvedValue(existingScenario);
      mockScenarioModel.findOne.mockReturnValue({ exec: mockExec });

      await expect(scenariosService.create(createScenarioDto)).rejects.toThrow(ConflictException);
      await expect(scenariosService.create(createScenarioDto)).rejects.toThrow(
        `Scenario with name "${createScenarioDto.name}" already exists`,
      );

      expect(mockScenarioModel.findOne).toHaveBeenCalledWith({ name: createScenarioDto.name });
      expect(mockScenarioModel).not.toHaveBeenCalled();
    });

    it('should create scenario with previousActions when provided', async () => {
      const dtoWithPreviousActions: CreateScenarioDto = {
        ...createScenarioDto,
        previousActions: [
          {
            position: Position.CO,
            actionType: 'raise' as any,
            sizing: 2.0,
          },
        ],
      };

      const mockExec = jest.fn().mockResolvedValue(null);
      mockScenarioModel.findOne.mockReturnValue({ exec: mockExec });

      const mockSave = jest.fn().mockResolvedValue({
        ...mockScenario,
        previousActions: dtoWithPreviousActions.previousActions,
        toObject: jest.fn().mockReturnValue({
          ...mockScenario,
          previousActions: dtoWithPreviousActions.previousActions,
        }),
      });

      const mockInstance = {
        save: mockSave,
      };
      mockScenarioModel.mockReturnValue(mockInstance);

      const result = await scenariosService.create(dtoWithPreviousActions);

      expect(mockScenarioModel).toHaveBeenCalledWith(dtoWithPreviousActions);
      expect(result.previousActions).toEqual(dtoWithPreviousActions.previousActions);
    });

    it('should create post-flop scenario with boardCards and boardTexture', async () => {
      const flopDto: CreateScenarioDto = {
        ...createScenarioDto,
        street: Street.FLOP,
        boardCards: 'As Kh 7d',
        boardTexture: BoardTexture.DRY,
      };

      const mockFlopScenario = {
        ...mockScenario,
        street: 'flop',
        boardCards: 'As Kh 7d',
        boardTexture: BoardTexture.DRY,
      };

      const mockExec = jest.fn().mockResolvedValue(null);
      mockScenarioModel.findOne.mockReturnValue({ exec: mockExec });

      const mockSave = jest.fn().mockResolvedValue({
        ...mockFlopScenario,
        toObject: jest.fn().mockReturnValue(mockFlopScenario),
      });

      const mockInstance = {
        save: mockSave,
      };
      mockScenarioModel.mockReturnValue(mockInstance);

      const result = await scenariosService.create(flopDto);

      expect(mockScenarioModel).toHaveBeenCalledWith(flopDto);
      expect(result.boardCards).toBe('As Kh 7d');
      expect(result.boardTexture).toBe(BoardTexture.DRY);
    });

    it('should create preflop scenario without boardCards and boardTexture', async () => {
      const mockExec = jest.fn().mockResolvedValue(null);
      mockScenarioModel.findOne.mockReturnValue({ exec: mockExec });

      const mockSave = jest.fn().mockResolvedValue({
        ...mockScenario,
        toObject: jest.fn().mockReturnValue(mockScenario),
      });

      const mockInstance = {
        save: mockSave,
      };
      mockScenarioModel.mockReturnValue(mockInstance);

      const result = await scenariosService.create(createScenarioDto);

      expect(mockScenarioModel).toHaveBeenCalledWith(createScenarioDto);
      expect(result.boardCards).toBeUndefined();
      expect(result.boardTexture).toBeUndefined();
    });

    it('should throw BadRequestException when post-flop scenario missing boardCards', async () => {
      const flopDtoWithoutBoardCards: CreateScenarioDto = {
        ...createScenarioDto,
        street: Street.FLOP,
        boardTexture: BoardTexture.DRY,
        // boardCards is missing
      };

      await expect(scenariosService.create(flopDtoWithoutBoardCards)).rejects.toThrow(
        'boardCards is required for post-flop scenarios',
      );
    });

    it('should throw BadRequestException when post-flop missing boardTexture', async () => {
      const flopDtoWithoutBoardTexture: CreateScenarioDto = {
        ...createScenarioDto,
        street: Street.FLOP,
        boardCards: 'As Kh 7d',
        // boardTexture is missing
      };

      await expect(scenariosService.create(flopDtoWithoutBoardTexture)).rejects.toThrow(
        'boardTexture is required for post-flop scenarios',
      );
    });

    it('should throw BadRequestException when boardCards has invalid format', async () => {
      const flopDtoWithInvalidFormat: CreateScenarioDto = {
        ...createScenarioDto,
        street: Street.FLOP,
        boardCards: 'As Kh 7', // Invalid format - missing suit
        boardTexture: BoardTexture.DRY,
      };

      await expect(scenariosService.create(flopDtoWithInvalidFormat)).rejects.toThrow(
        'boardCards must be in format "As Kh 7d" with 3-5 cards for post-flop scenarios',
      );
    });

    it('should throw BadRequestException when boardCards has too few cards', async () => {
      const flopDtoWithTooFewCards: CreateScenarioDto = {
        ...createScenarioDto,
        street: Street.FLOP,
        boardCards: 'As Kh', // Only 2 cards, need 3 for flop
        boardTexture: BoardTexture.DRY,
      };

      await expect(scenariosService.create(flopDtoWithTooFewCards)).rejects.toThrow(
        'boardCards must be in format "As Kh 7d" with 3-5 cards for post-flop scenarios',
      );
    });

    it('should throw BadRequestException when boardCards has invalid rank', async () => {
      const flopDtoWithInvalidRank: CreateScenarioDto = {
        ...createScenarioDto,
        street: Street.FLOP,
        boardCards: 'Bs Kh 7d', // Invalid rank 'B'
        boardTexture: BoardTexture.DRY,
      };

      await expect(scenariosService.create(flopDtoWithInvalidRank)).rejects.toThrow(
        'boardCards must be in format "As Kh 7d" with 3-5 cards for post-flop scenarios',
      );
    });
  });
});
