// NestJS
import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRangeAttemptsService } from '../user-range-attempts.service';
import {
  UserRangeAttempt,
  UserRangeAttemptSchema,
  UserRangeAttemptDocument,
} from '../schemas/user-range-attempt.schema';
import { ComparisonResult } from '../interfaces/comparison-result.interface';
import { ActionType } from '../../ranges/enums/action-type.enum';

describe('UserRangeAttemptsService Integration', () => {
  let service: UserRangeAttemptsService;
  let model: Model<UserRangeAttemptDocument>;
  let module: TestingModule;

  const mockUserId = 'user-uuid-123';
  const mockScenarioId = '507f1f77bcf86cd799439011';
  const mockRangeId1 = '507f1f77bcf86cd799439012';
  const mockRangeId2 = '507f1f77bcf86cd799439013';

  const mockComparisonResult1: ComparisonResult = {
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

  const mockComparisonResult2: ComparisonResult = {
    accuracyScore: 90.0,
    handsByCategory: {
      correct: [
        {
          hand: 'AA',
          userAction: [{ type: ActionType.RAISE, frequency: 100 }],
          gtoAction: [{ type: ActionType.RAISE, frequency: 100 }],
        },
        {
          hand: 'KK',
          userAction: [{ type: ActionType.RAISE, frequency: 100 }],
          gtoAction: [{ type: ActionType.RAISE, frequency: 100 }],
        },
      ],
      missing: [],
      extra: [],
      frequencyError: [],
    },
    overallFeedback: 'You matched 2 out of 2 hands correctly (100.0%).',
  };

  beforeAll(async () => {
    // Use in-memory MongoDB for testing
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/texas_test';

    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongoUri, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }),
        MongooseModule.forFeature([
          { name: UserRangeAttempt.name, schema: UserRangeAttemptSchema },
        ]),
      ],
      providers: [UserRangeAttemptsService],
    }).compile();

    service = module.get<UserRangeAttemptsService>(UserRangeAttemptsService);
    model = module.get<Model<UserRangeAttemptDocument>>(getModelToken(UserRangeAttempt.name));
  });

  afterAll(async () => {
    if (module) {
      await module.close();
    }
  });

  beforeEach(async () => {
    // Clean up attempts before each test
    await model.deleteMany({});
  });

  describe('Full Comparison Flow', () => {
    it('should create attempt with attemptNumber 1 for first attempt', async () => {
      const attempt = await service.createAttempt(
        mockUserId,
        mockScenarioId,
        mockRangeId1,
        mockComparisonResult1,
      );

      expect(attempt.attemptNumber).toBe(1);
      expect(attempt.userId).toBe(mockUserId);
      expect(attempt.comparisonResult.accuracyScore).toBe(85.5);
      expect(attempt.comparisonResult.missingHands).toEqual(['KK']);
      expect(attempt.comparisonResult.extraHands).toEqual(['72o']);
      expect(attempt.comparisonResult.frequencyErrors).toHaveLength(1);
      expect(attempt.comparisonResult.frequencyErrors[0]).toMatchObject({
        hand: 'QQ',
        userFrequency: 75,
        gtoFrequency: 100,
        difference: 25,
      });
    });

    it('should increment attemptNumber for subsequent attempts', async () => {
      // Create first attempt
      const attempt1 = await service.createAttempt(
        mockUserId,
        mockScenarioId,
        mockRangeId1,
        mockComparisonResult1,
      );
      expect(attempt1.attemptNumber).toBe(1);

      // Create second attempt
      const attempt2 = await service.createAttempt(
        mockUserId,
        mockScenarioId,
        mockRangeId2,
        mockComparisonResult2,
      );
      expect(attempt2.attemptNumber).toBe(2);

      // Create third attempt
      const attempt3 = await service.createAttempt(
        mockUserId,
        mockScenarioId,
        mockRangeId1,
        mockComparisonResult1,
      );
      expect(attempt3.attemptNumber).toBe(3);
    });

    it('should retrieve attempts sorted by attemptNumber ascending', async () => {
      // Create attempts in non-sequential order
      await service.createAttempt(mockUserId, mockScenarioId, mockRangeId1, mockComparisonResult2);
      await service.createAttempt(mockUserId, mockScenarioId, mockRangeId2, mockComparisonResult1);
      await service.createAttempt(mockUserId, mockScenarioId, mockRangeId1, mockComparisonResult2);

      const attempts = await service.findByUserAndScenario(mockUserId, mockScenarioId);

      expect(attempts).toHaveLength(3);
      expect(attempts[0].attemptNumber).toBe(1);
      expect(attempts[1].attemptNumber).toBe(2);
      expect(attempts[2].attemptNumber).toBe(3);
    });

    it('should isolate attempts by user and scenario', async () => {
      const otherUserId = 'other-user-id';
      const otherScenarioId = '507f1f77bcf86cd799439014';

      // Create attempts for different users/scenarios
      await service.createAttempt(mockUserId, mockScenarioId, mockRangeId1, mockComparisonResult1);
      await service.createAttempt(otherUserId, mockScenarioId, mockRangeId1, mockComparisonResult1);
      await service.createAttempt(mockUserId, otherScenarioId, mockRangeId1, mockComparisonResult1);

      // Should only return attempts for specific user/scenario
      const attempts = await service.findByUserAndScenario(mockUserId, mockScenarioId);

      expect(attempts).toHaveLength(1);
      expect(attempts[0].userId).toBe(mockUserId);
      expect(attempts[0].scenarioId.toString()).toBe(mockScenarioId);
    });

    it('should persist comparison results correctly', async () => {
      const attempt = await service.createAttempt(
        mockUserId,
        mockScenarioId,
        mockRangeId1,
        mockComparisonResult1,
      );

      // Retrieve from database
      const savedAttempt = await model.findById(attempt._id).exec();

      expect(savedAttempt).toBeTruthy();
      expect(savedAttempt?.comparisonResult.accuracyScore).toBe(85.5);
      expect(savedAttempt?.comparisonResult.missingHands).toEqual(['KK']);
      expect(savedAttempt?.comparisonResult.extraHands).toEqual(['72o']);
      expect(savedAttempt?.comparisonResult.frequencyErrors).toHaveLength(1);
      expect(savedAttempt?.comparisonResult.frequencyErrors[0]).toMatchObject({
        hand: 'QQ',
        userFrequency: 75,
        gtoFrequency: 100,
        difference: 25,
      });
    });

    it('should handle multiple attempts with different ranges', async () => {
      // Create multiple attempts with different ranges
      const attempt1 = await service.createAttempt(
        mockUserId,
        mockScenarioId,
        mockRangeId1,
        mockComparisonResult1,
      );
      const attempt2 = await service.createAttempt(
        mockUserId,
        mockScenarioId,
        mockRangeId2,
        mockComparisonResult2,
      );

      expect(attempt1.rangeId.toString()).toBe(mockRangeId1);
      expect(attempt2.rangeId.toString()).toBe(mockRangeId2);
      expect(attempt1.attemptNumber).toBe(1);
      expect(attempt2.attemptNumber).toBe(2);

      // Verify both attempts are retrievable
      const attempts = await service.findByUserAndScenario(mockUserId, mockScenarioId);
      expect(attempts).toHaveLength(2);
    });
  });
});
