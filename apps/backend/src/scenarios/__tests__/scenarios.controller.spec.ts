import { Test, TestingModule } from '@nestjs/testing';
import { ScenariosController } from '../scenarios.controller';
import { ScenariosService } from '../scenarios.service';
import { ConflictException } from '@nestjs/common';
import { Position, GameType, Difficulty, ScenarioActionType, Category, Street } from '../enums';
import { CreateScenarioDto, ScenarioResponseDto } from '../dtos';

describe('ScenariosController', () => {
  let controller: ScenariosController;
  let service: ScenariosService;

  const mockScenario: ScenarioResponseDto = {
    _id: '507f1f77bcf86cd799439011',
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
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCreateScenarioDto: CreateScenarioDto = {
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScenariosController],
      providers: [
        {
          provide: ScenariosService,
          useValue: {
            findAll: jest.fn(),
            findById: jest.fn(),
            findByCategory: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ScenariosController>(ScenariosController);
    service = module.get<ScenariosService>(ScenariosService);
  });

  describe('getScenarios', () => {
    it('should return an array of scenarios', async () => {
      const mockScenarios = [mockScenario];
      jest.spyOn(service, 'findAll').mockResolvedValue(mockScenarios);

      const result = await controller.getScenarios();

      expect(result).toEqual(mockScenarios);
      expect(service.findAll).toHaveBeenCalledWith(undefined, undefined, undefined);
    });

    it('should filter by gameType', async () => {
      const mockScenarios = [mockScenario];
      jest.spyOn(service, 'findAll').mockResolvedValue(mockScenarios);

      const result = await controller.getScenarios(GameType.TOURNAMENT);

      expect(result).toEqual(mockScenarios);
      expect(service.findAll).toHaveBeenCalledWith(GameType.TOURNAMENT, undefined, undefined);
    });

    it('should filter by difficulty', async () => {
      const mockScenarios = [mockScenario];
      jest.spyOn(service, 'findAll').mockResolvedValue(mockScenarios);

      const result = await controller.getScenarios(undefined, Difficulty.BEGINNER);

      expect(result).toEqual(mockScenarios);
      expect(service.findAll).toHaveBeenCalledWith(undefined, Difficulty.BEGINNER, undefined);
    });

    it('should filter by category', async () => {
      const mockScenarios = [mockScenario];
      jest.spyOn(service, 'findAll').mockResolvedValue(mockScenarios);

      const result = await controller.getScenarios(undefined, undefined, Category.OPENING_RANGES);

      expect(result).toEqual(mockScenarios);
      expect(service.findAll).toHaveBeenCalledWith(undefined, undefined, Category.OPENING_RANGES);
    });
  });

  describe('getScenarioById', () => {
    it('should return a scenario by id', async () => {
      jest.spyOn(service, 'findById').mockResolvedValue(mockScenario);

      const result = await controller.getScenarioById('507f1f77bcf86cd799439011');

      expect(result).toEqual(mockScenario);
      expect(service.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });
  });

  describe('getScenariosByCategory', () => {
    it('should return scenarios for a specific category', async () => {
      const mockScenarios = [mockScenario];
      jest.spyOn(service, 'findByCategory').mockResolvedValue(mockScenarios);

      const result = await controller.getScenariosByCategory(Category.OPENING_RANGES);

      expect(result).toEqual(mockScenarios);
      expect(service.findByCategory).toHaveBeenCalledWith(Category.OPENING_RANGES);
    });
  });

  describe('createScenario', () => {
    it('should create a new scenario', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(mockScenario);

      const result = await controller.createScenario(mockCreateScenarioDto);

      expect(result).toEqual(mockScenario);
      expect(service.create).toHaveBeenCalledWith(mockCreateScenarioDto);
    });

    it('should throw ConflictException when scenario name already exists', async () => {
      jest
        .spyOn(service, 'create')
        .mockRejectedValue(
          new ConflictException(
            `Scenario with name "${mockCreateScenarioDto.name}" already exists`,
          ),
        );

      await expect(controller.createScenario(mockCreateScenarioDto)).rejects.toThrow(
        ConflictException,
      );
      expect(service.create).toHaveBeenCalledWith(mockCreateScenarioDto);
    });
  });
});
