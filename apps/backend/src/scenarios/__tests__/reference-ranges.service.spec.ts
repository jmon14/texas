// NestJS
import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { ReferenceRangesService } from '../reference-ranges.service';
import { ScenariosService } from '../scenarios.service';
import { ReferenceRange } from '../schemas/reference-range.schema';
import { ActionType } from '../../ranges/enums/action-type.enum';
import { Types } from 'mongoose';

describe('ReferenceRangesService', () => {
  let service: ReferenceRangesService;
  let mockReferenceRangeModel: any;
  let mockScenariosService: jest.Mocked<ScenariosService>;

  const mockScenarioId = '507f1f77bcf86cd799439011';
  const mockSolvedRange = {
    name: 'Test Range',
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
    scenarioId: new Types.ObjectId(mockScenarioId),
    rangeData: mockSolvedRange,
    solver: 'TexasSolver',
    solverVersion: 'v1.0.1',
    solveDate: new Date(),
    solveParameters: {
      iterations: 100,
      accuracy: '0.5',
    },
    verified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    save: jest.fn().mockResolvedValue(this),
    toObject: jest.fn().mockReturnThis(),
  };

  beforeEach(async () => {
    // Mock ScenariosService
    mockScenariosService = {
      findById: jest.fn(),
    } as any;

    // Mock ReferenceRange model
    mockReferenceRangeModel = jest.fn().mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(mockReferenceRange),
    }));

    mockReferenceRangeModel.findOne = jest.fn();
    mockReferenceRangeModel.prototype.save = jest.fn();

    const module = await Test.createTestingModule({
      providers: [
        ReferenceRangesService,
        {
          provide: getModelToken(ReferenceRange.name),
          useValue: mockReferenceRangeModel,
        },
        {
          provide: ScenariosService,
          useValue: mockScenariosService,
        },
      ],
    }).compile();

    service = module.get<ReferenceRangesService>(ReferenceRangesService);
  });

  describe('findByScenarioId', () => {
    it('should return reference range when found', async () => {
      const mockExec = jest.fn().mockResolvedValue(mockReferenceRange);
      mockReferenceRangeModel.findOne.mockReturnValue({ exec: mockExec });

      const result = await service.findByScenarioId(mockScenarioId);

      expect(mockReferenceRangeModel.findOne).toHaveBeenCalledWith({
        scenarioId: new Types.ObjectId(mockScenarioId),
      });
      expect(result).toEqual(mockReferenceRange);
    });

    it('should return null when reference range not found', async () => {
      const mockExec = jest.fn().mockResolvedValue(null);
      mockReferenceRangeModel.findOne.mockReturnValue({ exec: mockExec });

      const result = await service.findByScenarioId(mockScenarioId);

      expect(result).toBeNull();
    });
  });

  describe('createOrUpdate', () => {
    const solverMetadata = {
      solver: 'TexasSolver',
      solverVersion: 'v1.0.1',
      solveParameters: {
        iterations: 100,
        accuracy: '0.5',
      },
    };

    it('should create new reference range when none exists', async () => {
      // Scenario exists
      mockScenariosService.findById.mockResolvedValue({ _id: mockScenarioId } as any);

      // No existing reference range
      const mockFindExec = jest.fn().mockResolvedValue(null);
      mockReferenceRangeModel.findOne.mockReturnValue({ exec: mockFindExec });

      // Mock save for new instance
      const mockSave = jest.fn().mockResolvedValue(mockReferenceRange);
      const mockNewInstance = {
        save: mockSave,
      };
      mockReferenceRangeModel.mockImplementation(() => mockNewInstance);

      const result = await service.createOrUpdate(mockScenarioId, mockSolvedRange, solverMetadata);

      expect(mockScenariosService.findById).toHaveBeenCalledWith(mockScenarioId);
      expect(mockReferenceRangeModel.findOne).toHaveBeenCalled();
      expect(mockReferenceRangeModel).toHaveBeenCalledWith({
        scenarioId: new Types.ObjectId(mockScenarioId),
        rangeData: mockSolvedRange,
        solver: solverMetadata.solver,
        solverVersion: solverMetadata.solverVersion,
        solveDate: expect.any(Date),
        solveParameters: solverMetadata.solveParameters,
        verified: false,
      });
      expect(mockSave).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should update existing reference range when one exists', async () => {
      // Scenario exists
      mockScenariosService.findById.mockResolvedValue({ _id: mockScenarioId } as any);

      // Existing reference range
      const existingRange = {
        ...mockReferenceRange,
        rangeData: { name: 'Old Range' },
        solver: 'OldSolver',
        solverVersion: 'v0.9.0',
        save: jest.fn().mockResolvedValue(mockReferenceRange),
      };
      const mockFindExec = jest.fn().mockResolvedValue(existingRange);
      mockReferenceRangeModel.findOne.mockReturnValue({ exec: mockFindExec });

      const result = await service.createOrUpdate(mockScenarioId, mockSolvedRange, solverMetadata);

      expect(mockScenariosService.findById).toHaveBeenCalledWith(mockScenarioId);
      expect(existingRange.rangeData).toEqual(mockSolvedRange);
      expect(existingRange.solver).toBe(solverMetadata.solver);
      expect(existingRange.solverVersion).toBe(solverMetadata.solverVersion);
      expect(existingRange.save).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should throw NotFoundException when scenario does not exist', async () => {
      mockScenariosService.findById.mockRejectedValue(
        new NotFoundException(`Scenario with ID ${mockScenarioId} not found`),
      );

      await expect(
        service.createOrUpdate(mockScenarioId, mockSolvedRange, solverMetadata),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
