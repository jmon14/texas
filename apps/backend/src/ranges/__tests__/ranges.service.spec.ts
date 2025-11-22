// NestJS
import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';

// Services
import { RangesService } from '../ranges.service';

// Schemas
import { Range } from '../schemas';
// Enums
import { ActionType } from '../enums';

// DTOs
import { CreateRangeDto, UpdateRangeDto } from '../dtos';

describe('RangesService', () => {
  let rangesService: RangesService;
  let mockRangeModel: any;

  const mockRange = {
    _id: '507f1f77bcf86cd799439011',
    name: 'UTG Opening Range',
    handsRange: [
      {
        carryoverFrequency: 100,
        label: 'AA, KK, QQ',
        actions: [{ type: ActionType.RAISE, frequency: 100 }],
      },
    ],
    userId: 'user-uuid',
    toObject: jest.fn().mockReturnThis(),
  };

  const mockCreateRangeDto: CreateRangeDto = {
    name: 'UTG Opening Range',
    handsRange: [
      {
        carryoverFrequency: 100,
        label: 'AA, KK, QQ',
        actions: [{ type: ActionType.RAISE, frequency: 100 }],
      },
    ],
    userId: 'user-uuid',
  };

  const mockUpdateRangeDto: UpdateRangeDto = {
    name: 'Updated Range Name',
  };

  beforeEach(async () => {
    // Create mock Mongoose model as a constructor function
    mockRangeModel = jest.fn().mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(mockRange),
    }));

    // Add static methods to the mock model
    mockRangeModel.find = jest.fn();
    mockRangeModel.findById = jest.fn();
    mockRangeModel.findByIdAndUpdate = jest.fn();
    mockRangeModel.findByIdAndDelete = jest.fn();

    const module = await Test.createTestingModule({
      providers: [
        RangesService,
        {
          provide: getModelToken(Range.name),
          useValue: mockRangeModel,
        },
      ],
    }).compile();

    rangesService = module.get<RangesService>(RangesService);
  });

  describe('saveRange', () => {
    it('should create and save a new range', async () => {
      const mockExec = jest.fn().mockResolvedValue([]);
      mockRangeModel.find.mockReturnValue({ exec: mockExec });

      const mockSavedRange = {
        ...mockRange,
        toObject: jest.fn().mockReturnValue(mockRange),
      };
      const saveMock = jest.fn().mockResolvedValue(mockSavedRange);
      mockRangeModel.mockImplementation(() => ({
        save: saveMock,
      }));

      const result = await rangesService.saveRange(mockCreateRangeDto);

      expect(mockRangeModel.find).toHaveBeenCalledWith({ userId: mockCreateRangeDto.userId });
      expect(saveMock).toHaveBeenCalled();
      expect(result).toEqual(mockRange);
    });

    it('should throw BadRequestException when user has 10 or more ranges', async () => {
      const tenRanges = Array(10).fill(mockRange);
      const mockExec = jest.fn().mockResolvedValue(tenRanges);
      mockRangeModel.find.mockReturnValue({ exec: mockExec });

      await expect(rangesService.saveRange(mockCreateRangeDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(rangesService.saveRange(mockCreateRangeDto)).rejects.toThrow(
        'User has reached the maximum limit of 10 ranges',
      );
    });
  });

  describe('getAllRanges', () => {
    it('should return all ranges', async () => {
      const mockRanges = [mockRange, { ...mockRange, _id: 'another-id' }];
      const mockExec = jest.fn().mockResolvedValue(mockRanges);
      mockRangeModel.find.mockReturnValue({ exec: mockExec });

      const result = await rangesService.getAllRanges();

      expect(mockRangeModel.find).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(mockRange.toObject).toHaveBeenCalled();
    });

    it('should return empty array when no ranges exist', async () => {
      const mockExec = jest.fn().mockResolvedValue([]);
      mockRangeModel.find.mockReturnValue({ exec: mockExec });

      const result = await rangesService.getAllRanges();

      expect(result).toEqual([]);
    });
  });

  describe('getRangesByUserId', () => {
    it('should return ranges for specific user', async () => {
      const mockRanges = [mockRange];
      const mockExec = jest.fn().mockResolvedValue(mockRanges);
      mockRangeModel.find.mockReturnValue({ exec: mockExec });

      const result = await rangesService.getRangesByUserId('user-uuid');

      expect(mockRangeModel.find).toHaveBeenCalledWith({ userId: 'user-uuid' });
      expect(result).toHaveLength(1);
    });

    it('should return empty array when user has no ranges', async () => {
      const mockExec = jest.fn().mockResolvedValue([]);
      mockRangeModel.find.mockReturnValue({ exec: mockExec });

      const result = await rangesService.getRangesByUserId('user-uuid');

      expect(result).toEqual([]);
    });
  });

  describe('getRangeById', () => {
    it('should return a range by id', async () => {
      const mockDoc = {
        ...mockRange,
        toObject: jest.fn().mockReturnValue(mockRange),
      };
      const mockExec = jest.fn().mockResolvedValue(mockDoc);
      mockRangeModel.findById.mockReturnValue({ exec: mockExec });

      const result = await rangesService.getRangeById('507f1f77bcf86cd799439011');

      expect(mockRangeModel.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(result).toEqual(mockRange);
    });

    it('should throw NotFoundException when range not found', async () => {
      const mockExec = jest.fn().mockResolvedValue(null);
      mockRangeModel.findById.mockReturnValue({ exec: mockExec });

      await expect(rangesService.getRangeById('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
      await expect(rangesService.getRangeById('non-existent-id')).rejects.toThrow(
        'Range with ID non-existent-id not found',
      );
    });
  });

  describe('updateRange', () => {
    it('should update and return the range', async () => {
      const updatedMockRange = { ...mockRange, ...mockUpdateRangeDto };
      const mockDoc = {
        ...updatedMockRange,
        toObject: jest.fn().mockReturnValue(updatedMockRange),
      };
      const mockExec = jest.fn().mockResolvedValue(mockDoc);
      mockRangeModel.findByIdAndUpdate.mockReturnValue({ exec: mockExec });

      const result = await rangesService.updateRange(
        '507f1f77bcf86cd799439011',
        mockUpdateRangeDto,
      );

      expect(mockRangeModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        mockUpdateRangeDto,
        { new: true },
      );
      expect(result).toEqual(updatedMockRange);
    });

    it('should throw NotFoundException when range not found', async () => {
      const mockExec = jest.fn().mockResolvedValue(null);
      mockRangeModel.findByIdAndUpdate.mockReturnValue({ exec: mockExec });

      await expect(
        rangesService.updateRange('non-existent-id', mockUpdateRangeDto),
      ).rejects.toThrow(NotFoundException);
      await expect(
        rangesService.updateRange('non-existent-id', mockUpdateRangeDto),
      ).rejects.toThrow('Range with ID non-existent-id not found');
    });
  });

  describe('deleteRange', () => {
    it('should delete a range', async () => {
      const mockExec = jest.fn().mockResolvedValue(mockRange);
      mockRangeModel.findByIdAndDelete.mockReturnValue({ exec: mockExec });

      await rangesService.deleteRange('507f1f77bcf86cd799439011');

      expect(mockRangeModel.findByIdAndDelete).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });

    it('should throw NotFoundException when range not found', async () => {
      const mockExec = jest.fn().mockResolvedValue(null);
      mockRangeModel.findByIdAndDelete.mockReturnValue({ exec: mockExec });

      await expect(rangesService.deleteRange('non-existent-id')).rejects.toThrow(NotFoundException);
      await expect(rangesService.deleteRange('non-existent-id')).rejects.toThrow(
        'Range with ID non-existent-id not found',
      );
    });
  });
});
