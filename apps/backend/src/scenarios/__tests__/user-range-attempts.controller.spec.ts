// NestJS
import { Test } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { UserRangeAttemptsController } from '../user-range-attempts.controller';
import { RangeComparisonService } from '../range-comparison.service';
import { UserRangeAttemptsService } from '../user-range-attempts.service';
import { RangesService } from '../../ranges/ranges.service';
import { CompareRangesDto } from '../dtos/compare-ranges.dto';
import { ComparisonResult } from '../interfaces/comparison-result.interface';
import { PayloadRequest } from '../../auth/interfaces/request.interface';
import { ActionType } from '../../ranges/enums/action-type.enum';
import { RangeResponseDto } from '../../ranges/dtos/range-response.dto';

describe('UserRangeAttemptsController', () => {
  let controller: UserRangeAttemptsController;
  let rangeComparisonService: RangeComparisonService;
  let userRangeAttemptsService: UserRangeAttemptsService;
  let rangesService: RangesService;

  const mockUserId = 'user-uuid-123';
  const mockScenarioId = '507f1f77bcf86cd799439011';
  const mockRangeId = '507f1f77bcf86cd799439012';
  const mockAttemptId = '507f1f77bcf86cd799439013';

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
          difference: 25,
        },
      ],
    },
    overallFeedback: 'You matched 1 out of 2 hands correctly (50.0%).',
  };

  const mockUserRange: RangeResponseDto = {
    _id: mockRangeId,
    name: 'Test Range',
    handsRange: [],
    userId: mockUserId,
  };

  const mockRequest: PayloadRequest = {
    user: { uuid: mockUserId },
  } as PayloadRequest;

  const mockRangeComparisonService = {
    compareRanges: jest.fn(),
  };

  const mockUserRangeAttemptsService = {
    createAttempt: jest.fn(),
    findByUserAndScenario: jest.fn(),
  };

  const mockRangesService = {
    getRangeById: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UserRangeAttemptsController],
      providers: [
        {
          provide: RangeComparisonService,
          useValue: mockRangeComparisonService,
        },
        {
          provide: UserRangeAttemptsService,
          useValue: mockUserRangeAttemptsService,
        },
        {
          provide: RangesService,
          useValue: mockRangesService,
        },
      ],
    }).compile();

    controller = module.get<UserRangeAttemptsController>(UserRangeAttemptsController);
    rangeComparisonService = module.get<RangeComparisonService>(RangeComparisonService);
    userRangeAttemptsService = module.get<UserRangeAttemptsService>(UserRangeAttemptsService);
    rangesService = module.get<RangesService>(RangesService);
  });

  describe('compareRanges', () => {
    const compareRangesDto: CompareRangesDto = {
      scenarioId: mockScenarioId,
      userRangeId: mockRangeId,
    };

    it('should successfully compare ranges and return result with attemptId', async () => {
      const mockAttempt = {
        _id: { toString: () => mockAttemptId },
        attemptNumber: 1,
      };

      jest.spyOn(rangesService, 'getRangeById').mockResolvedValue(mockUserRange);
      jest.spyOn(rangeComparisonService, 'compareRanges').mockResolvedValue(mockComparisonResult);
      jest.spyOn(userRangeAttemptsService, 'createAttempt').mockResolvedValue(mockAttempt as any);

      const result = await controller.compareRanges(compareRangesDto, mockRequest);

      expect(rangesService.getRangeById).toHaveBeenCalledWith(mockRangeId);
      expect(rangeComparisonService.compareRanges).toHaveBeenCalledWith(
        mockScenarioId,
        mockRangeId,
      );
      expect(userRangeAttemptsService.createAttempt).toHaveBeenCalledWith(
        mockUserId,
        mockScenarioId,
        mockRangeId,
        mockComparisonResult,
      );
      expect(result.attemptId).toBe(mockAttemptId);
      expect(result.attemptNumber).toBe(1);
      expect(result.accuracyScore).toBe(85.5);
    });

    it('should throw NotFoundException when range not found', async () => {
      jest.spyOn(rangesService, 'getRangeById').mockResolvedValue(null);

      await expect(controller.compareRanges(compareRangesDto, mockRequest)).rejects.toThrow(
        NotFoundException,
      );
      await expect(controller.compareRanges(compareRangesDto, mockRequest)).rejects.toThrow(
        `Range with ID ${mockRangeId} not found`,
      );
    });

    it('should throw NotFoundException when user does not own the range', async () => {
      const otherUserRange = {
        ...mockUserRange,
        userId: 'other-user-id',
      };

      jest.spyOn(rangesService, 'getRangeById').mockResolvedValue(otherUserRange as any);

      await expect(controller.compareRanges(compareRangesDto, mockRequest)).rejects.toThrow(
        NotFoundException,
      );
      await expect(controller.compareRanges(compareRangesDto, mockRequest)).rejects.toThrow(
        `Range with ID ${mockRangeId} not found`,
      );
    });

    it('should propagate NotFoundException from RangeComparisonService', async () => {
      jest.spyOn(rangesService, 'getRangeById').mockResolvedValue(mockUserRange);
      jest
        .spyOn(rangeComparisonService, 'compareRanges')
        .mockRejectedValue(new NotFoundException('Reference range not found'));

      await expect(controller.compareRanges(compareRangesDto, mockRequest)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should transform ComparisonResult to ComparisonResultDto correctly', async () => {
      const mockAttempt = {
        _id: { toString: () => mockAttemptId },
        attemptNumber: 2,
      };

      jest.spyOn(rangesService, 'getRangeById').mockResolvedValue(mockUserRange);
      jest.spyOn(rangeComparisonService, 'compareRanges').mockResolvedValue(mockComparisonResult);
      jest.spyOn(userRangeAttemptsService, 'createAttempt').mockResolvedValue(mockAttempt as any);

      const result = await controller.compareRanges(compareRangesDto, mockRequest);

      expect(result.correct).toHaveLength(1);
      expect(result.missing).toHaveLength(1);
      expect(result.extra).toHaveLength(1);
      expect(result.frequencyError).toHaveLength(1);
      expect(result.overallFeedback).toBe(mockComparisonResult.overallFeedback);
    });
  });

  describe('getAttemptHistory', () => {
    it('should return attempt history sorted by attemptNumber', async () => {
      const mockAttempts = [
        {
          _id: { toString: () => 'attempt-1' },
          userId: mockUserId,
          scenarioId: { toString: () => mockScenarioId },
          rangeId: { toString: () => mockRangeId },
          comparisonResult: {
            accuracyScore: 85.5,
            missingHands: ['KK'],
            extraHands: ['72o'],
            frequencyErrors: [],
          },
          attemptNumber: 1,
          createdAt: new Date('2025-01-15T10:00:00Z'),
          updatedAt: new Date('2025-01-15T10:00:00Z'),
        },
        {
          _id: { toString: () => 'attempt-2' },
          userId: mockUserId,
          scenarioId: { toString: () => mockScenarioId },
          rangeId: { toString: () => mockRangeId },
          comparisonResult: {
            accuracyScore: 90.0,
            missingHands: [],
            extraHands: [],
            frequencyErrors: [],
          },
          attemptNumber: 2,
          createdAt: new Date('2025-01-15T11:00:00Z'),
          updatedAt: new Date('2025-01-15T11:00:00Z'),
        },
      ];

      jest
        .spyOn(userRangeAttemptsService, 'findByUserAndScenario')
        .mockResolvedValue(mockAttempts as any);

      const result = await controller.getAttemptHistory(mockUserId, mockScenarioId, mockRequest);

      expect(userRangeAttemptsService.findByUserAndScenario).toHaveBeenCalledWith(
        mockUserId,
        mockScenarioId,
      );
      expect(result).toHaveLength(2);
      expect(result[0].attemptNumber).toBe(1);
      expect(result[1].attemptNumber).toBe(2);
    });

    it('should throw ForbiddenException when userId mismatch', async () => {
      const differentUserId = 'different-user-id';

      await expect(
        controller.getAttemptHistory(differentUserId, mockScenarioId, mockRequest),
      ).rejects.toThrow(ForbiddenException);
      await expect(
        controller.getAttemptHistory(differentUserId, mockScenarioId, mockRequest),
      ).rejects.toThrow('You can only access your own attempts');
    });

    it('should return empty array when no attempts exist', async () => {
      jest.spyOn(userRangeAttemptsService, 'findByUserAndScenario').mockResolvedValue([]);

      const result = await controller.getAttemptHistory(mockUserId, mockScenarioId, mockRequest);

      expect(result).toEqual([]);
    });

    it('should transform attempts to UserRangeAttemptResponseDto correctly', async () => {
      const mockAttempt = {
        _id: { toString: () => mockAttemptId },
        userId: mockUserId,
        scenarioId: { toString: () => mockScenarioId },
        rangeId: { toString: () => mockRangeId },
        comparisonResult: {
          accuracyScore: 85.5,
          missingHands: ['KK'],
          extraHands: ['72o'],
          frequencyErrors: [
            {
              hand: 'QQ',
              userFrequency: 75,
              gtoFrequency: 100,
              difference: 25,
            },
          ],
        },
        attemptNumber: 1,
        createdAt: new Date('2025-01-15T10:00:00Z'),
        updatedAt: new Date('2025-01-15T10:00:00Z'),
      };

      jest
        .spyOn(userRangeAttemptsService, 'findByUserAndScenario')
        .mockResolvedValue([mockAttempt] as any);

      const result = await controller.getAttemptHistory(mockUserId, mockScenarioId, mockRequest);

      expect(result[0]).toMatchObject({
        _id: mockAttemptId,
        userId: mockUserId,
        scenarioId: mockScenarioId,
        rangeId: mockRangeId,
        attemptNumber: 1,
        comparisonResult: {
          accuracyScore: 85.5,
          missingHands: ['KK'],
          extraHands: ['72o'],
          frequencyErrors: [
            {
              hand: 'QQ',
              userFrequency: 75,
              gtoFrequency: 100,
              difference: 25,
            },
          ],
        },
      });
    });
  });
});
