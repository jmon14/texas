// NestJS
import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UserRangeAttemptsService } from '../user-range-attempts.service';
import { UserRangeAttempt } from '../schemas/user-range-attempt.schema';
import { ComparisonResult } from '../interfaces/comparison-result.interface';
import { ActionType } from '../../ranges/enums/action-type.enum';

describe('UserRangeAttemptsService', () => {
  let service: UserRangeAttemptsService;
  let mockUserRangeAttemptModel: any;

  const mockUserId = 'user-uuid-123';
  const mockScenarioId = '507f1f77bcf86cd799439011';
  const mockRangeId = '507f1f77bcf86cd799439012';

  const mockComparisonResult: ComparisonResult = {
    accuracyScore: 85.5,
    handsByCategory: {
      correct: [
        {
          hand: 'AA',
          userAction: [{ type: ActionType.RAISE, frequency: 100 }],
          gtoAction: [{ type: ActionType.RAISE, frequency: 100 }],
        },
      ],
      missing: [
        {
          hand: 'KK',
          gtoAction: [{ type: ActionType.RAISE, frequency: 100 }],
          reason: 'Included in GTO range',
        },
      ],
      extra: [
        {
          hand: '72o',
          userAction: [{ type: ActionType.FOLD, frequency: 100 }],
          reason: 'Not in GTO range',
        },
      ],
      frequencyError: [
        {
          hand: 'QQ',
          userAction: [{ type: ActionType.RAISE, frequency: 75 }],
          gtoAction: [{ type: ActionType.RAISE, frequency: 100 }],
          maxDifference: 25,
          actions: [
            {
              type: ActionType.RAISE,
              userFrequency: 75,
              gtoFrequency: 100,
              difference: 25,
            },
          ],
        },
      ],
    },
    overallFeedback: 'You matched 1 out of 2 hands correctly (50.0%).',
  };

  beforeEach(async () => {
    // Create mock Mongoose model
    mockUserRangeAttemptModel = jest.fn().mockImplementation((data) => ({
      ...data,
      save: jest.fn().mockResolvedValue({
        _id: '507f1f77bcf86cd799439013',
        ...data,
        toObject: jest.fn().mockReturnValue({
          _id: '507f1f77bcf86cd799439013',
          ...data,
        }),
      }),
    }));

    // Add static methods - tests will override these as needed
    mockUserRangeAttemptModel.find = jest.fn();

    const module = await Test.createTestingModule({
      providers: [
        UserRangeAttemptsService,
        {
          provide: getModelToken(UserRangeAttempt.name),
          useValue: mockUserRangeAttemptModel,
        },
      ],
    }).compile();

    service = module.get<UserRangeAttemptsService>(UserRangeAttemptsService);
  });

  describe('createAttempt', () => {
    it('should create attempt with attemptNumber 1 when no existing attempts', async () => {
      mockUserRangeAttemptModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      });

      const mockSave = jest.fn().mockResolvedValue({
        _id: '507f1f77bcf86cd799439013',
        userId: mockUserId,
        scenarioId: mockScenarioId,
        rangeId: mockRangeId,
        comparisonResult: expect.any(Object),
        attemptNumber: 1,
        toObject: jest.fn().mockReturnValue({
          _id: '507f1f77bcf86cd799439013',
          userId: mockUserId,
          scenarioId: mockScenarioId,
          rangeId: mockRangeId,
          comparisonResult: expect.any(Object),
          attemptNumber: 1,
        }),
      });

      const mockInstance = {
        save: mockSave,
      };
      mockUserRangeAttemptModel.mockReturnValue(mockInstance);

      const result = await service.createAttempt(
        mockUserId,
        mockScenarioId,
        mockRangeId,
        mockComparisonResult,
      );

      expect(mockUserRangeAttemptModel).toHaveBeenCalled();
      expect(mockSave).toHaveBeenCalled();
      expect(result.attemptNumber).toBe(1);
    });

    it('should increment attemptNumber when existing attempts exist', async () => {
      const existingAttempts = [{ attemptNumber: 1 }, { attemptNumber: 2 }];

      mockUserRangeAttemptModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(existingAttempts),
      });

      const mockSave = jest.fn().mockResolvedValue({
        _id: '507f1f77bcf86cd799439013',
        userId: mockUserId,
        scenarioId: mockScenarioId,
        rangeId: mockRangeId,
        comparisonResult: expect.any(Object),
        attemptNumber: 3,
        toObject: jest.fn().mockReturnValue({
          _id: '507f1f77bcf86cd799439013',
          userId: mockUserId,
          scenarioId: mockScenarioId,
          rangeId: mockRangeId,
          comparisonResult: expect.any(Object),
          attemptNumber: 3,
        }),
      });

      const mockInstance = {
        save: mockSave,
      };
      mockUserRangeAttemptModel.mockReturnValue(mockInstance);

      const result = await service.createAttempt(
        mockUserId,
        mockScenarioId,
        mockRangeId,
        mockComparisonResult,
      );

      expect(result.attemptNumber).toBe(3);
    });

    it('should transform ComparisonResult to schema format', async () => {
      mockUserRangeAttemptModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      });

      let capturedData: Record<string, unknown>;
      const mockSave = jest.fn().mockImplementation(async function () {
        return {
          _id: '507f1f77bcf86cd799439013',
          userId: this.userId,
          scenarioId: this.scenarioId,
          rangeId: this.rangeId,
          comparisonResult: this.comparisonResult,
          attemptNumber: this.attemptNumber,
          toObject: jest.fn().mockReturnValue({
            _id: '507f1f77bcf86cd799439013',
            userId: this.userId,
            scenarioId: this.scenarioId,
            rangeId: this.rangeId,
            comparisonResult: this.comparisonResult,
            attemptNumber: this.attemptNumber,
          }),
        };
      });

      mockUserRangeAttemptModel.mockImplementation((data) => {
        capturedData = data;
        const instance = { ...data, save: mockSave };
        return instance;
      });

      await service.createAttempt(mockUserId, mockScenarioId, mockRangeId, mockComparisonResult);

      expect(mockSave).toHaveBeenCalled();
      expect(capturedData!.comparisonResult).toHaveProperty('accuracyScore');
      expect(capturedData!.comparisonResult).toHaveProperty('missingHands');
      expect(capturedData!.comparisonResult).toHaveProperty('extraHands');
      expect(capturedData!.comparisonResult).toHaveProperty('frequencyErrors');
      expect((capturedData!.comparisonResult as { missingHands: string[] }).missingHands).toEqual([
        'KK',
      ]);
      expect((capturedData!.comparisonResult as { extraHands: string[] }).extraHands).toEqual([
        '72o',
      ]);
      expect(
        (capturedData!.comparisonResult as { frequencyErrors: unknown[] }).frequencyErrors,
      ).toHaveLength(1);
      expect(
        (capturedData!.comparisonResult as { frequencyErrors: Array<Record<string, unknown>> })
          .frequencyErrors[0],
      ).toMatchObject({
        hand: 'QQ',
        maxDifference: 25,
        actions: [
          {
            type: ActionType.RAISE,
            userFrequency: 75,
            gtoFrequency: 100,
            difference: 25,
          },
        ],
      });
    });
  });

  describe('findByUserAndScenario', () => {
    it('should return attempts sorted by attemptNumber ascending', async () => {
      const mockAttempts = [
        {
          _id: 'attempt-1',
          attemptNumber: 2,
          toObject: jest.fn().mockReturnValue({ _id: 'attempt-1', attemptNumber: 2 }),
        },
        {
          _id: 'attempt-2',
          attemptNumber: 1,
          toObject: jest.fn().mockReturnValue({ _id: 'attempt-2', attemptNumber: 1 }),
        },
        {
          _id: 'attempt-3',
          attemptNumber: 3,
          toObject: jest.fn().mockReturnValue({ _id: 'attempt-3', attemptNumber: 3 }),
        },
      ];

      const mockExec = jest.fn().mockResolvedValue(mockAttempts);
      const mockSort = jest.fn().mockReturnValue({
        exec: mockExec,
      });

      mockUserRangeAttemptModel.find.mockReturnValue({
        sort: mockSort,
      });

      const result = await service.findByUserAndScenario(mockUserId, mockScenarioId);

      expect(mockUserRangeAttemptModel.find).toHaveBeenCalledWith({
        userId: mockUserId,
        scenarioId: expect.any(Object),
      });
      expect(mockSort).toHaveBeenCalledWith({ attemptNumber: 1 });
      expect(result).toEqual(mockAttempts);
    });

    it('should return empty array when no attempts exist', async () => {
      const mockExec = jest.fn().mockResolvedValue([]);
      const mockSort = jest.fn().mockReturnValue({
        exec: mockExec,
      });

      mockUserRangeAttemptModel.find.mockReturnValue({
        sort: mockSort,
      });

      const result = await service.findByUserAndScenario(mockUserId, mockScenarioId);

      expect(result).toEqual([]);
    });
  });
});
