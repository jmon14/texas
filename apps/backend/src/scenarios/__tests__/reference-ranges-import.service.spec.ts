// NestJS
import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ReferenceRangesImportService } from '../reference-ranges-import.service';
import { ReferenceRangesService } from '../reference-ranges.service';
import { ScenariosService } from '../scenarios.service';
import { StandardRangesService } from '../standard-ranges.service';
import { TexasSolverService } from '../../ranges/texas-solver.service';
import { Position } from '../enums/position.enum';
import { ScenarioActionType } from '../enums/scenario-action-type.enum';
import { Street } from '../enums/street.enum';
import { PlayerPosition } from '../../ranges/enums/player-position.enum';
import { ActionType } from '../../ranges/enums/action-type.enum';

describe('ReferenceRangesImportService', () => {
  let service: ReferenceRangesImportService;
  let mockScenariosService: jest.Mocked<ScenariosService>;
  let mockStandardRangesService: jest.Mocked<StandardRangesService>;
  let mockTexasSolverService: jest.Mocked<TexasSolverService>;
  let mockReferenceRangesService: jest.Mocked<ReferenceRangesService>;

  const mockScenarioId = '507f1f77bcf86cd799439011';

  const mockFlopScenario = {
    _id: mockScenarioId,
    name: 'BTN vs BB Flop Cbet - Dry Board',
    street: Street.FLOP,
    position: Position.BTN,
    vsPosition: Position.BB,
    actionType: ScenarioActionType.CBET,
    effectiveStack: 100,
    betSize: 2.0,
    boardCards: '7s 4c 2h',
    boardTexture: 'dry',
  };

  const mockSolvedRange = {
    name: 'Solved Range',
    userId: 'system',
    handsRange: [
      {
        label: 'AA',
        carryoverFrequency: 100,
        actions: [{ type: ActionType.RAISE, frequency: 100 }],
      },
    ],
  };

  const mockReferenceRange = {
    _id: '507f1f77bcf86cd799439012',
    scenarioId: mockScenarioId,
    rangeData: mockSolvedRange,
    toObject: jest.fn().mockReturnValue({}),
  };

  beforeEach(async () => {
    // Mock services
    mockScenariosService = {
      findById: jest.fn(),
      findAll: jest.fn(),
    } as any;

    mockStandardRangesService = {
      getOpeningRange: jest.fn().mockReturnValue('AA,KK,QQ'),
      getDefendingRange: jest.fn().mockReturnValue('AA,KK,QQ,JJ'),
      getThreeBettingRange: jest.fn().mockReturnValue('AA,KK,QQ'),
    } as any;

    mockTexasSolverService = {
      solveScenario: jest.fn().mockResolvedValue(mockSolvedRange),
    } as any;

    mockReferenceRangesService = {
      createOrUpdate: jest.fn().mockResolvedValue(mockReferenceRange),
    } as any;

    const module = await Test.createTestingModule({
      providers: [
        ReferenceRangesImportService,
        {
          provide: ScenariosService,
          useValue: mockScenariosService,
        },
        {
          provide: StandardRangesService,
          useValue: mockStandardRangesService,
        },
        {
          provide: TexasSolverService,
          useValue: mockTexasSolverService,
        },
        {
          provide: ReferenceRangesService,
          useValue: mockReferenceRangesService,
        },
      ],
    }).compile();

    service = module.get<ReferenceRangesImportService>(ReferenceRangesImportService);
  });

  describe('importForScenario', () => {
    it('should successfully import reference range for flop scenario', async () => {
      mockScenariosService.findById.mockResolvedValue(mockFlopScenario as any);

      const result = await service.importForScenario(mockScenarioId);

      expect(mockScenariosService.findById).toHaveBeenCalledWith(mockScenarioId);
      expect(mockStandardRangesService.getOpeningRange).toHaveBeenCalledWith(Position.BTN);
      expect(mockStandardRangesService.getDefendingRange).toHaveBeenCalledWith(
        Position.BB,
        Position.BTN,
      );
      expect(mockTexasSolverService.solveScenario).toHaveBeenCalledWith(
        expect.objectContaining({
          name: mockFlopScenario.name,
          boardCards: mockFlopScenario.boardCards,
          playerPosition: expect.any(Number),
        }),
      );
      expect(mockReferenceRangesService.createOrUpdate).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should throw NotFoundException when scenario not found', async () => {
      mockScenariosService.findById.mockResolvedValue(null);

      await expect(service.importForScenario(mockScenarioId)).rejects.toThrow(NotFoundException);
      expect(mockScenariosService.findById).toHaveBeenCalledWith(mockScenarioId);
      expect(mockTexasSolverService.solveScenario).not.toHaveBeenCalled();
    });

    it('should handle solver errors gracefully', async () => {
      mockScenariosService.findById.mockResolvedValue(mockFlopScenario as any);
      mockTexasSolverService.solveScenario.mockRejectedValue(new Error('Solver failed'));

      await expect(service.importForScenario(mockScenarioId)).rejects.toThrow('Solver failed');
    });

    it('should cap effective stack when stack-to-pot ratio is too high', async () => {
      const highStackScenario = {
        ...mockFlopScenario,
        effectiveStack: 1000, // Very high stack
      };
      mockScenariosService.findById.mockResolvedValue(highStackScenario as any);

      await service.importForScenario(mockScenarioId);

      const solveCall = mockTexasSolverService.solveScenario.mock.calls[0][0];
      // Effective stack should be capped (pot is ~6.5, max ratio is 10, so max stack is ~65)
      expect(solveCall.effectiveStack).toBeLessThanOrEqual(65);
    });
  });

  describe('importAllScenarios', () => {
    it('should import all scenarios successfully', async () => {
      const scenarios = [mockFlopScenario, { ...mockFlopScenario, _id: 'another-id' }];
      mockScenariosService.findAll.mockResolvedValue(scenarios as any);
      mockScenariosService.findById.mockResolvedValue(mockFlopScenario as any);

      const results = await service.importAllScenarios();

      expect(mockScenariosService.findAll).toHaveBeenCalled();
      expect(mockTexasSolverService.solveScenario).toHaveBeenCalledTimes(2);
      expect(results).toHaveLength(2);
    });

    it('should continue importing when one scenario fails', async () => {
      const scenarios = [
        mockFlopScenario,
        { ...mockFlopScenario, _id: 'another-id' },
        { ...mockFlopScenario, _id: 'third-id' },
      ];
      mockScenariosService.findAll.mockResolvedValue(scenarios as any);
      mockScenariosService.findById
        .mockResolvedValueOnce(mockFlopScenario as any)
        .mockRejectedValueOnce(new Error('Scenario 2 failed'))
        .mockResolvedValueOnce(mockFlopScenario as any);

      const results = await service.importAllScenarios();

      expect(results).toHaveLength(2); // 2 succeeded, 1 failed
      expect(mockTexasSolverService.solveScenario).toHaveBeenCalledTimes(2);
    });
  });

  describe('calculatePot (private method via integration)', () => {
    it('should calculate correct pot for preflop scenario', async () => {
      const preflopScenario = {
        ...mockFlopScenario,
        street: Street.PREFLOP,
      };
      mockScenariosService.findById.mockResolvedValue(preflopScenario as any);

      await service.importForScenario(mockScenarioId);

      const solveCall = mockTexasSolverService.solveScenario.mock.calls[0][0];
      // Preflop pot: blinds (1.5) + open (2.5) + call (2.5) = 6.5
      expect(solveCall.pot).toBe(7); // Rounded
    });

    it('should calculate correct pot for flop scenario', async () => {
      mockScenariosService.findById.mockResolvedValue(mockFlopScenario as any);

      await service.importForScenario(mockScenarioId);

      const solveCall = mockTexasSolverService.solveScenario.mock.calls[0][0];
      // Flop pot: preflop (6.5) + flop bet (2.0) = 8.5
      expect(solveCall.pot).toBe(9); // Rounded
    });

    it('should calculate correct pot for turn scenario', async () => {
      const turnScenario = {
        ...mockFlopScenario,
        street: Street.TURN,
        boardCards: '7s 4c 2h 5d',
      };
      mockScenariosService.findById.mockResolvedValue(turnScenario as any);

      await service.importForScenario(mockScenarioId);

      const solveCall = mockTexasSolverService.solveScenario.mock.calls[0][0];
      // Turn pot: preflop (6.5) + flop bet (2.0) + turn bet (2.0) = 10.5
      expect(solveCall.pot).toBe(11); // Rounded
    });

    it('should calculate correct pot for river scenario', async () => {
      const riverScenario = {
        ...mockFlopScenario,
        street: Street.RIVER,
        boardCards: '7s 4c 2h 5d 9h',
      };
      mockScenariosService.findById.mockResolvedValue(riverScenario as any);

      await service.importForScenario(mockScenarioId);

      const solveCall = mockTexasSolverService.solveScenario.mock.calls[0][0];
      // River pot: preflop (6.5) + flop (2.0) + turn (2.0) + river (2.0) = 12.5
      expect(solveCall.pot).toBe(13); // Rounded
    });
  });

  describe('determineSolverInputs (private method via integration)', () => {
    it('should determine correct ranges for CBET scenario', async () => {
      mockScenariosService.findById.mockResolvedValue(mockFlopScenario as any);

      await service.importForScenario(mockScenarioId);

      expect(mockStandardRangesService.getOpeningRange).toHaveBeenCalledWith(Position.BTN);
      expect(mockStandardRangesService.getDefendingRange).toHaveBeenCalledWith(
        Position.BB,
        Position.BTN,
      );
    });

    it('should determine correct ranges for VS_CBET_CALL scenario', async () => {
      const vsCbetCallScenario = {
        ...mockFlopScenario,
        position: Position.BB,
        vsPosition: Position.BTN,
        actionType: ScenarioActionType.VS_CBET_CALL,
      };
      mockScenariosService.findById.mockResolvedValue(vsCbetCallScenario as any);

      await service.importForScenario(mockScenarioId);

      expect(mockStandardRangesService.getDefendingRange).toHaveBeenCalledWith(
        Position.BB,
        Position.BTN,
      );
      expect(mockStandardRangesService.getOpeningRange).toHaveBeenCalledWith(Position.BTN);
    });

    it('should determine correct ranges for VS_CBET_RAISE scenario', async () => {
      const vsCbetRaiseScenario = {
        ...mockFlopScenario,
        position: Position.BB,
        vsPosition: Position.BTN,
        actionType: ScenarioActionType.VS_CBET_RAISE,
      };
      mockScenariosService.findById.mockResolvedValue(vsCbetRaiseScenario as any);

      await service.importForScenario(mockScenarioId);

      expect(mockStandardRangesService.getThreeBettingRange).toHaveBeenCalledWith(
        Position.BB,
        Position.BTN,
      );
      expect(mockStandardRangesService.getOpeningRange).toHaveBeenCalledWith(Position.BTN);
    });

    it('should throw error for unsupported action type', async () => {
      const unsupportedScenario = {
        ...mockFlopScenario,
        actionType: ScenarioActionType.OPEN, // Preflop action type
      };
      mockScenariosService.findById.mockResolvedValue(unsupportedScenario as any);

      await expect(service.importForScenario(mockScenarioId)).rejects.toThrow(
        'Unsupported action type',
      );
    });

    it('should correctly determine IP/OOP for postflop positions', async () => {
      // BTN vs BB on flop: BTN is IP (acts last postflop)
      mockScenariosService.findById.mockResolvedValue(mockFlopScenario as any);

      await service.importForScenario(mockScenarioId);

      const solveCall = mockTexasSolverService.solveScenario.mock.calls[0][0];
      // BTN should be IP (PlayerPosition.IP = 0)
      expect(solveCall.playerPosition).toBe(PlayerPosition.IP);
    });

    it('should correctly determine OOP for BB vs BTN on flop', async () => {
      const bbVsBtnScenario = {
        ...mockFlopScenario,
        position: Position.BB,
        vsPosition: Position.BTN,
        actionType: ScenarioActionType.VS_CBET_CALL,
      };
      mockScenariosService.findById.mockResolvedValue(bbVsBtnScenario as any);

      await service.importForScenario(mockScenarioId);

      const solveCall = mockTexasSolverService.solveScenario.mock.calls[0][0];
      // BB should be OOP (acts first postflop)
      expect(solveCall.playerPosition).toBe(PlayerPosition.OOP);
    });
  });
});
