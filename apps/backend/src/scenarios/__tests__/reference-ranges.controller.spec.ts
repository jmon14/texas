// NestJS
import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ReferenceRangesController } from '../reference-ranges.controller';
import { ReferenceRangesService } from '../reference-ranges.service';
import { ReferenceRangesImportService } from '../reference-ranges-import.service';
import { ActionType } from '../../ranges/enums/action-type.enum';

describe('ReferenceRangesController', () => {
  let controller: ReferenceRangesController;
  let mockReferenceRangesService: jest.Mocked<ReferenceRangesService>;
  let mockReferenceRangesImportService: jest.Mocked<ReferenceRangesImportService>;

  const mockScenarioId = '507f1f77bcf86cd799439011';

  const getMockReferenceRangeObject = () => ({
    _id: '507f1f77bcf86cd799439012',
    scenarioId: mockScenarioId,
    rangeData: {
      name: 'Test Range',
      userId: 'system',
      handsRange: [
        {
          label: 'AA',
          carryoverFrequency: 100,
          actions: [{ type: ActionType.RAISE, frequency: 100 }],
        },
      ],
    },
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
  });

  const getMockReferenceRange = () => {
    const mockObject = getMockReferenceRangeObject();
    return {
      ...mockObject,
      toObject: jest.fn().mockReturnValue(mockObject),
    };
  };

  beforeEach(async () => {
    mockReferenceRangesService = {
      findByScenarioId: jest.fn(),
    } as any;

    mockReferenceRangesImportService = {
      importForScenario: jest.fn(),
      importAllScenarios: jest.fn(),
    } as any;

    const module = await Test.createTestingModule({
      controllers: [ReferenceRangesController],
      providers: [
        {
          provide: ReferenceRangesService,
          useValue: mockReferenceRangesService,
        },
        {
          provide: ReferenceRangesImportService,
          useValue: mockReferenceRangesImportService,
        },
      ],
    }).compile();

    controller = module.get<ReferenceRangesController>(ReferenceRangesController);
  });

  describe('getByScenarioId', () => {
    it('should return reference range when found', async () => {
      const mockRange = getMockReferenceRange();
      mockReferenceRangesService.findByScenarioId.mockResolvedValue(mockRange as any);

      const result = await controller.getByScenarioId(mockScenarioId);

      expect(mockReferenceRangesService.findByScenarioId).toHaveBeenCalledWith(mockScenarioId);
      expect(result).toBeDefined();
      expect(result.scenarioId).toBe(mockScenarioId);
      expect(result.solver).toBe('TexasSolver');
    });

    it('should throw NotFoundException when reference range not found', async () => {
      mockReferenceRangesService.findByScenarioId.mockResolvedValue(null);

      await expect(controller.getByScenarioId(mockScenarioId)).rejects.toThrow(NotFoundException);
      expect(mockReferenceRangesService.findByScenarioId).toHaveBeenCalledWith(mockScenarioId);
    });
  });

  describe('importForScenario', () => {
    it('should successfully import reference range', async () => {
      const mockRange = getMockReferenceRange();
      mockReferenceRangesImportService.importForScenario.mockResolvedValue(mockRange as any);

      const result = await controller.importForScenario(mockScenarioId);

      expect(mockReferenceRangesImportService.importForScenario).toHaveBeenCalledWith(
        mockScenarioId,
      );
      expect(result).toBeDefined();
      expect(result.scenarioId).toBe(mockScenarioId);
    });

    it('should propagate NotFoundException when scenario not found', async () => {
      mockReferenceRangesImportService.importForScenario.mockRejectedValue(
        new NotFoundException(`Scenario with ID ${mockScenarioId} not found`),
      );

      await expect(controller.importForScenario(mockScenarioId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('importAllScenarios', () => {
    it('should successfully import all scenarios', async () => {
      const mockRange1 = getMockReferenceRange();
      const mockRange2Object = {
        ...getMockReferenceRangeObject(),
        _id: 'another-id',
      };
      const mockRange2 = {
        ...mockRange2Object,
        toObject: jest.fn().mockReturnValue(mockRange2Object),
      };
      mockReferenceRangesImportService.importAllScenarios.mockResolvedValue([
        mockRange1,
        mockRange2,
      ] as any);

      const results = await controller.importAllScenarios();

      expect(mockReferenceRangesImportService.importAllScenarios).toHaveBeenCalled();
      expect(results).toHaveLength(2);
      expect(results[0].scenarioId).toBe(mockScenarioId);
    });

    it('should return empty array when no scenarios exist', async () => {
      mockReferenceRangesImportService.importAllScenarios.mockResolvedValue([]);

      const results = await controller.importAllScenarios();

      expect(results).toEqual([]);
    });
  });
});
