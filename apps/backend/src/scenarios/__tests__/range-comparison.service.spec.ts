// NestJS
import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { RangeComparisonService } from '../range-comparison.service';
import { ReferenceRangesService } from '../reference-ranges.service';
import { RangesService } from '../../ranges/ranges.service';
import { ActionType } from '../../ranges/enums/action-type.enum';
import { HandRange } from '../../ranges/schemas/hand-range.schema';
import { Action } from '../../ranges/schemas/action.schema';

describe('RangeComparisonService', () => {
  let service: RangeComparisonService;
  let mockReferenceRangesService: jest.Mocked<ReferenceRangesService>;
  let mockRangesService: jest.Mocked<RangesService>;

  const mockScenarioId = '507f1f77bcf86cd799439011';
  const mockUserRangeId = '507f1f77bcf86cd799439012';

  beforeEach(async () => {
    // Mock services
    mockReferenceRangesService = {
      findByScenarioId: jest.fn(),
    } as any;

    mockRangesService = {
      getRangeById: jest.fn(),
    } as any;

    const module = await Test.createTestingModule({
      providers: [
        RangeComparisonService,
        {
          provide: ReferenceRangesService,
          useValue: mockReferenceRangesService,
        },
        {
          provide: RangesService,
          useValue: mockRangesService,
        },
      ],
    }).compile();

    service = module.get<RangeComparisonService>(RangeComparisonService);
  });

  describe('compareRanges', () => {
    it('should compare user range to GTO reference range successfully', async () => {
      const gtoHandsRange: HandRange[] = [
        {
          label: 'AA',
          carryoverFrequency: 100,
          actions: [{ type: ActionType.RAISE, frequency: 100 }],
        },
        {
          label: 'KK',
          carryoverFrequency: 100,
          actions: [{ type: ActionType.RAISE, frequency: 100 }],
        },
      ];

      const userHandsRange: HandRange[] = [
        {
          label: 'AA',
          carryoverFrequency: 100,
          actions: [{ type: ActionType.RAISE, frequency: 100 }],
        },
        {
          label: 'KK',
          carryoverFrequency: 100,
          actions: [{ type: ActionType.RAISE, frequency: 100 }],
        },
      ];

      const mockReferenceRange = {
        rangeData: {
          handsRange: gtoHandsRange,
        },
      };

      const mockUserRange = {
        handsRange: userHandsRange,
      };

      mockReferenceRangesService.findByScenarioId.mockResolvedValue(mockReferenceRange as any);
      mockRangesService.getRangeById.mockResolvedValue(mockUserRange as any);

      const result = await service.compareRanges(mockScenarioId, mockUserRangeId);

      expect(result.accuracyScore).toBe(100);
      expect(result.handsByCategory.correct).toHaveLength(2);
      expect(result.handsByCategory.missing).toHaveLength(0);
      expect(result.handsByCategory.extra).toHaveLength(0);
      expect(result.handsByCategory.frequencyError).toHaveLength(0);
    });

    it('should throw NotFoundException when reference range not found', async () => {
      mockReferenceRangesService.findByScenarioId.mockResolvedValue(null);

      await expect(service.compareRanges(mockScenarioId, mockUserRangeId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.compareRanges(mockScenarioId, mockUserRangeId)).rejects.toThrow(
        `Reference range not found for scenario ${mockScenarioId}`,
      );
    });

    it('should throw NotFoundException when user range not found', async () => {
      const mockReferenceRange = {
        rangeData: {
          handsRange: [],
        },
      };

      mockReferenceRangesService.findByScenarioId.mockResolvedValue(mockReferenceRange as any);
      mockRangesService.getRangeById.mockRejectedValue(
        new NotFoundException(`Range with ID ${mockUserRangeId} not found`),
      );

      await expect(service.compareRanges(mockScenarioId, mockUserRangeId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('compareRangeData - correct hands detection', () => {
    it('should identify correct hands when actions match exactly', () => {
      const gtoHandsRange: HandRange[] = [
        {
          label: 'AA',
          carryoverFrequency: 100,
          actions: [{ type: ActionType.RAISE, frequency: 100 }],
        },
      ];

      const userHandsRange: HandRange[] = [
        {
          label: 'AA',
          carryoverFrequency: 100,
          actions: [{ type: ActionType.RAISE, frequency: 100 }],
        },
      ];

      const result = service['compareRangeData'](userHandsRange, gtoHandsRange);

      expect(result.accuracyScore).toBe(100);
      expect(result.handsByCategory.correct).toHaveLength(1);
      expect(result.handsByCategory.correct[0].hand).toBe('AA');
      expect(result.handsByCategory.missing).toHaveLength(0);
      expect(result.handsByCategory.extra).toHaveLength(0);
      expect(result.handsByCategory.frequencyError).toHaveLength(0);
    });

    it('should identify correct hands when frequency difference is within threshold (5%)', () => {
      const gtoHandsRange: HandRange[] = [
        {
          label: 'AA',
          carryoverFrequency: 100,
          actions: [{ type: ActionType.RAISE, frequency: 100 }],
        },
      ];

      const userHandsRange: HandRange[] = [
        {
          label: 'AA',
          carryoverFrequency: 100,
          actions: [{ type: ActionType.RAISE, frequency: 97 }], // 3% difference
        },
      ];

      const result = service['compareRangeData'](userHandsRange, gtoHandsRange);

      expect(result.accuracyScore).toBe(100);
      expect(result.handsByCategory.correct).toHaveLength(1);
      expect(result.handsByCategory.frequencyError).toHaveLength(0);
    });

    it('should identify correct hands with mixed strategies when frequencies match', () => {
      const gtoHandsRange: HandRange[] = [
        {
          label: 'AKs',
          carryoverFrequency: 100,
          actions: [
            { type: ActionType.RAISE, frequency: 50 },
            { type: ActionType.CALL, frequency: 50 },
          ],
        },
      ];

      const userHandsRange: HandRange[] = [
        {
          label: 'AKs',
          carryoverFrequency: 100,
          actions: [
            { type: ActionType.RAISE, frequency: 50 },
            { type: ActionType.CALL, frequency: 50 },
          ],
        },
      ];

      const result = service['compareRangeData'](userHandsRange, gtoHandsRange);

      expect(result.accuracyScore).toBe(100);
      expect(result.handsByCategory.correct).toHaveLength(1);
    });
  });

  describe('compareRangeData - missing hands detection', () => {
    it('should identify missing hands that are in GTO but not in user range', () => {
      const gtoHandsRange: HandRange[] = [
        {
          label: 'AA',
          carryoverFrequency: 100,
          actions: [{ type: ActionType.RAISE, frequency: 100 }],
        },
        {
          label: 'KK',
          carryoverFrequency: 100,
          actions: [{ type: ActionType.RAISE, frequency: 100 }],
        },
      ];

      const userHandsRange: HandRange[] = [
        {
          label: 'AA',
          carryoverFrequency: 100,
          actions: [{ type: ActionType.RAISE, frequency: 100 }],
        },
      ];

      const result = service['compareRangeData'](userHandsRange, gtoHandsRange);

      expect(result.handsByCategory.missing).toHaveLength(1);
      expect(result.handsByCategory.missing[0].hand).toBe('KK');
      expect(result.handsByCategory.missing[0].reason).toBe('Included in GTO range');
      expect(result.accuracyScore).toBe(50); // 1 correct out of 2
    });
  });

  describe('compareRangeData - extra hands detection', () => {
    it('should identify extra hands that are in user range but not in GTO', () => {
      const gtoHandsRange: HandRange[] = [
        {
          label: 'AA',
          carryoverFrequency: 100,
          actions: [{ type: ActionType.RAISE, frequency: 100 }],
        },
      ];

      const userHandsRange: HandRange[] = [
        {
          label: 'AA',
          carryoverFrequency: 100,
          actions: [{ type: ActionType.RAISE, frequency: 100 }],
        },
        {
          label: '72o',
          carryoverFrequency: 100,
          actions: [{ type: ActionType.FOLD, frequency: 100 }],
        },
      ];

      const result = service['compareRangeData'](userHandsRange, gtoHandsRange);

      expect(result.handsByCategory.extra).toHaveLength(1);
      expect(result.handsByCategory.extra[0].hand).toBe('72o');
      expect(result.handsByCategory.extra[0].reason).toBe('Not in GTO range');
    });
  });

  describe('compareRangeData - frequency error detection', () => {
    it('should identify frequency errors when difference exceeds threshold', () => {
      const gtoHandsRange: HandRange[] = [
        {
          label: 'AA',
          carryoverFrequency: 100,
          actions: [{ type: ActionType.RAISE, frequency: 100 }],
        },
      ];

      const userHandsRange: HandRange[] = [
        {
          label: 'AA',
          carryoverFrequency: 100,
          actions: [{ type: ActionType.RAISE, frequency: 90 }], // 10% difference
        },
      ];

      const result = service['compareRangeData'](userHandsRange, gtoHandsRange);

      expect(result.handsByCategory.frequencyError).toHaveLength(1);
      expect(result.handsByCategory.frequencyError[0].hand).toBe('AA');
      expect(result.handsByCategory.frequencyError[0].difference).toBe(10);
      expect(result.accuracyScore).toBe(0); // No correct hands
    });

    it('should identify frequency errors with mixed strategies', () => {
      const gtoHandsRange: HandRange[] = [
        {
          label: 'AKs',
          carryoverFrequency: 100,
          actions: [
            { type: ActionType.RAISE, frequency: 50 },
            { type: ActionType.CALL, frequency: 50 },
          ],
        },
      ];

      const userHandsRange: HandRange[] = [
        {
          label: 'AKs',
          carryoverFrequency: 100,
          actions: [
            { type: ActionType.RAISE, frequency: 80 },
            { type: ActionType.CALL, frequency: 20 },
          ],
        },
      ];

      const result = service['compareRangeData'](userHandsRange, gtoHandsRange);

      expect(result.handsByCategory.frequencyError).toHaveLength(1);
      expect(result.handsByCategory.frequencyError[0].difference).toBe(30);
    });
  });

  describe('compareRangeData - accuracy score calculation', () => {
    it('should calculate accuracy score correctly', () => {
      const gtoHandsRange: HandRange[] = [
        {
          label: 'AA',
          carryoverFrequency: 100,
          actions: [{ type: ActionType.RAISE, frequency: 100 }],
        },
        {
          label: 'KK',
          carryoverFrequency: 100,
          actions: [{ type: ActionType.RAISE, frequency: 100 }],
        },
        {
          label: 'QQ',
          carryoverFrequency: 100,
          actions: [{ type: ActionType.RAISE, frequency: 100 }],
        },
      ];

      const userHandsRange: HandRange[] = [
        {
          label: 'AA',
          carryoverFrequency: 100,
          actions: [{ type: ActionType.RAISE, frequency: 100 }],
        },
        {
          label: 'KK',
          carryoverFrequency: 100,
          actions: [{ type: ActionType.RAISE, frequency: 100 }],
        },
      ];

      const result = service['compareRangeData'](userHandsRange, gtoHandsRange);

      // 2 correct out of 3 total = 66.67%
      expect(result.accuracyScore).toBeCloseTo(66.67, 1);
    });

    it('should return 0% accuracy when no hands match', () => {
      const gtoHandsRange: HandRange[] = [
        {
          label: 'AA',
          carryoverFrequency: 100,
          actions: [{ type: ActionType.RAISE, frequency: 100 }],
        },
      ];

      const userHandsRange: HandRange[] = [];

      const result = service['compareRangeData'](userHandsRange, gtoHandsRange);

      expect(result.accuracyScore).toBe(0);
    });

    it('should return 0% accuracy when GTO range is empty', () => {
      const gtoHandsRange: HandRange[] = [];
      const userHandsRange: HandRange[] = [
        {
          label: 'AA',
          carryoverFrequency: 100,
          actions: [{ type: ActionType.RAISE, frequency: 100 }],
        },
      ];

      const result = service['compareRangeData'](userHandsRange, gtoHandsRange);

      expect(result.accuracyScore).toBe(0);
    });
  });

  describe('compareActions', () => {
    it('should calculate frequency difference correctly for single action', () => {
      const userActions: Action[] = [{ type: ActionType.RAISE, frequency: 100 }];
      const gtoActions: Action[] = [{ type: ActionType.RAISE, frequency: 100 }];

      const result = service['compareActions'](userActions, gtoActions);

      expect(result.frequencyDifference).toBe(0);
    });

    it('should calculate frequency difference for different action types', () => {
      const userActions: Action[] = [{ type: ActionType.RAISE, frequency: 50 }];
      const gtoActions: Action[] = [{ type: ActionType.CALL, frequency: 100 }];

      const result = service['compareActions'](userActions, gtoActions);

      expect(result.frequencyDifference).toBe(100); // Max difference across all types
    });

    it('should sum frequencies by action type for mixed strategies', () => {
      const userActions: Action[] = [
        { type: ActionType.RAISE, frequency: 50 },
        { type: ActionType.CALL, frequency: 50 },
      ];
      const gtoActions: Action[] = [{ type: ActionType.RAISE, frequency: 100 }];

      const result = service['compareActions'](userActions, gtoActions);

      // User: RAISE 50%, CALL 50%
      // GTO: RAISE 100%, CALL 0%
      // Max difference: RAISE 50% or CALL 50% = 50%
      expect(result.frequencyDifference).toBe(50);
    });

    it('should handle multiple actions of same type', () => {
      const userActions: Action[] = [
        { type: ActionType.RAISE, frequency: 30 },
        { type: ActionType.RAISE, frequency: 20 },
      ];
      const gtoActions: Action[] = [{ type: ActionType.RAISE, frequency: 50 }];

      const result = service['compareActions'](userActions, gtoActions);

      // User: RAISE total = 50%
      // GTO: RAISE total = 50%
      expect(result.frequencyDifference).toBe(0);
    });
  });

  describe('sumFrequenciesByType', () => {
    it('should sum frequencies by action type', () => {
      const actions: Action[] = [
        { type: ActionType.RAISE, frequency: 50 },
        { type: ActionType.CALL, frequency: 30 },
        { type: ActionType.RAISE, frequency: 20 },
      ];

      const result = service['sumFrequenciesByType'](actions);

      expect(result[ActionType.RAISE]).toBe(70);
      expect(result[ActionType.CALL]).toBe(30);
    });

    it('should return empty object for empty actions array', () => {
      const actions: Action[] = [];

      const result = service['sumFrequenciesByType'](actions);

      expect(result).toEqual({});
    });
  });

  describe('generateOverallFeedback', () => {
    it('should generate feedback with all categories', () => {
      const results = {
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
            userAction: [{ type: ActionType.RAISE, frequency: 90 }],
            gtoAction: [{ type: ActionType.RAISE, frequency: 100 }],
            difference: 10,
          },
        ],
      };

      const feedback = service['generateOverallFeedback'](results, 33.33);

      expect(feedback).toContain('matched 1 out of 3 hands correctly');
      expect(feedback).toContain('Missing 1 hand');
      expect(feedback).toContain('Included 1 hand');
      expect(feedback).toContain('1 hand has frequency errors');
    });

    it('should generate feedback for perfect match', () => {
      const results = {
        correct: [
          {
            hand: 'AA',
            userAction: [{ type: ActionType.RAISE, frequency: 100 }],
            gtoAction: [{ type: ActionType.RAISE, frequency: 100 }],
          },
        ],
        missing: [],
        extra: [],
        frequencyError: [],
      };

      const feedback = service['generateOverallFeedback'](results, 100);

      expect(feedback).toContain('matched 1 out of 1 hands correctly (100.0%)');
      expect(feedback).not.toContain('Missing');
      expect(feedback).not.toContain('Included');
      expect(feedback).not.toContain('frequency errors');
    });

    it('should handle pluralization correctly', () => {
      const results = {
        correct: [],
        missing: [
          {
            hand: 'AA',
            gtoAction: [{ type: ActionType.RAISE, frequency: 100 }],
            reason: 'Included in GTO range',
          },
          {
            hand: 'KK',
            gtoAction: [{ type: ActionType.RAISE, frequency: 100 }],
            reason: 'Included in GTO range',
          },
        ],
        extra: [],
        frequencyError: [],
      };

      const feedback = service['generateOverallFeedback'](results, 0);

      expect(feedback).toContain('Missing 2 hands');
    });
  });

  describe('edge cases', () => {
    it('should handle empty ranges', () => {
      const result = service['compareRangeData']([], []);

      expect(result.accuracyScore).toBe(0);
      expect(result.handsByCategory.correct).toHaveLength(0);
      expect(result.handsByCategory.missing).toHaveLength(0);
      expect(result.handsByCategory.extra).toHaveLength(0);
      expect(result.handsByCategory.frequencyError).toHaveLength(0);
    });

    it('should handle completely different ranges', () => {
      const gtoHandsRange: HandRange[] = [
        {
          label: 'AA',
          carryoverFrequency: 100,
          actions: [{ type: ActionType.RAISE, frequency: 100 }],
        },
      ];

      const userHandsRange: HandRange[] = [
        {
          label: '72o',
          carryoverFrequency: 100,
          actions: [{ type: ActionType.FOLD, frequency: 100 }],
        },
      ];

      const result = service['compareRangeData'](userHandsRange, gtoHandsRange);

      expect(result.accuracyScore).toBe(0);
      expect(result.handsByCategory.missing).toHaveLength(1);
      expect(result.handsByCategory.extra).toHaveLength(1);
    });

    it('should handle action type mismatches correctly', () => {
      const gtoHandsRange: HandRange[] = [
        {
          label: 'AA',
          carryoverFrequency: 100,
          actions: [{ type: ActionType.RAISE, frequency: 100 }],
        },
      ];

      const userHandsRange: HandRange[] = [
        {
          label: 'AA',
          carryoverFrequency: 100,
          actions: [{ type: ActionType.CALL, frequency: 100 }],
        },
      ];

      const result = service['compareRangeData'](userHandsRange, gtoHandsRange);

      // RAISE vs CALL: RAISE difference = 100%, CALL difference = 100%
      // Max difference = 100%, which exceeds threshold
      expect(result.handsByCategory.frequencyError).toHaveLength(1);
      expect(result.handsByCategory.frequencyError[0].difference).toBe(100);
    });
  });
});
