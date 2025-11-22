// NestJS
import { Test } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';

// Controller
import { RangesController } from '../ranges.controller';

// Services
import { RangesService } from '../ranges.service';

// DTOs
import { CreateRangeDto, UpdateRangeDto, RangeResponseDto } from '../dtos';

// Schemas
// Enums
import { ActionType } from '../enums';

describe('RangesController', () => {
  let rangesController: RangesController;
  let rangesService: RangesService;

  const mockRangeResponse: RangeResponseDto = {
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

  const mockedRangesService = {
    saveRange: jest.fn(),
    getAllRanges: jest.fn(),
    getRangesByUserId: jest.fn(),
    getRangeById: jest.fn(),
    updateRange: jest.fn(),
    deleteRange: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [RangesController],
      providers: [
        {
          provide: RangesService,
          useValue: mockedRangesService,
        },
      ],
    }).compile();

    rangesController = module.get<RangesController>(RangesController);
    rangesService = module.get<RangesService>(RangesService);
  });

  describe('getRanges', () => {
    it('should return all ranges', async () => {
      const mockRanges = [mockRangeResponse];
      jest.spyOn(rangesService, 'getAllRanges').mockResolvedValue(mockRanges);

      const result = await rangesController.getRanges();

      expect(rangesService.getAllRanges).toHaveBeenCalled();
      expect(result).toEqual(mockRanges);
    });

    it('should return empty array when no ranges exist', async () => {
      jest.spyOn(rangesService, 'getAllRanges').mockResolvedValue([]);

      const result = await rangesController.getRanges();

      expect(result).toEqual([]);
    });
  });

  describe('getRangesByUserId', () => {
    it('should return ranges for specific user', async () => {
      const mockRanges = [mockRangeResponse];
      jest.spyOn(rangesService, 'getRangesByUserId').mockResolvedValue(mockRanges);

      const result = await rangesController.getRangesByUserId('user-uuid');

      expect(rangesService.getRangesByUserId).toHaveBeenCalledWith('user-uuid');
      expect(result).toEqual(mockRanges);
    });

    it('should return empty array when user has no ranges', async () => {
      jest.spyOn(rangesService, 'getRangesByUserId').mockResolvedValue([]);

      const result = await rangesController.getRangesByUserId('user-uuid');

      expect(result).toEqual([]);
    });
  });

  describe('createRange', () => {
    it('should create and return a new range', async () => {
      jest.spyOn(rangesService, 'saveRange').mockResolvedValue(mockRangeResponse);

      const result = await rangesController.createRange(mockCreateRangeDto);

      expect(rangesService.saveRange).toHaveBeenCalledWith(mockCreateRangeDto);
      expect(result).toEqual(mockRangeResponse);
    });

    it('should throw BadRequestException when user has 10+ ranges', async () => {
      jest
        .spyOn(rangesService, 'saveRange')
        .mockRejectedValue(
          new BadRequestException('User has reached the maximum limit of 10 ranges'),
        );

      await expect(rangesController.createRange(mockCreateRangeDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(rangesController.createRange(mockCreateRangeDto)).rejects.toThrow(
        'User has reached the maximum limit of 10 ranges',
      );
    });
  });

  describe('getRangeById', () => {
    it('should return a range by id', async () => {
      jest.spyOn(rangesService, 'getRangeById').mockResolvedValue(mockRangeResponse);

      const result = await rangesController.getRangeById('507f1f77bcf86cd799439011');

      expect(rangesService.getRangeById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(result).toEqual(mockRangeResponse);
    });

    it('should throw NotFoundException when range not found', async () => {
      jest
        .spyOn(rangesService, 'getRangeById')
        .mockRejectedValue(new NotFoundException('Range with ID non-existent-id not found'));

      await expect(rangesController.getRangeById('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
      await expect(rangesController.getRangeById('non-existent-id')).rejects.toThrow(
        'Range with ID non-existent-id not found',
      );
    });
  });

  describe('updateRange', () => {
    it('should update and return the range', async () => {
      const updatedRange = { ...mockRangeResponse, ...mockUpdateRangeDto };
      jest.spyOn(rangesService, 'updateRange').mockResolvedValue(updatedRange);

      const result = await rangesController.updateRange(
        '507f1f77bcf86cd799439011',
        mockUpdateRangeDto,
      );

      expect(rangesService.updateRange).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        mockUpdateRangeDto,
      );
      expect(result).toEqual(updatedRange);
    });

    it('should throw NotFoundException when range not found', async () => {
      jest
        .spyOn(rangesService, 'updateRange')
        .mockRejectedValue(new NotFoundException('Range with ID non-existent-id not found'));

      await expect(
        rangesController.updateRange('non-existent-id', mockUpdateRangeDto),
      ).rejects.toThrow(NotFoundException);
      await expect(
        rangesController.updateRange('non-existent-id', mockUpdateRangeDto),
      ).rejects.toThrow('Range with ID non-existent-id not found');
    });
  });

  describe('deleteRange', () => {
    it('should delete a range', async () => {
      jest.spyOn(rangesService, 'deleteRange').mockResolvedValue(undefined);

      await rangesController.deleteRange('507f1f77bcf86cd799439011');

      expect(rangesService.deleteRange).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });

    it('should throw NotFoundException when range not found', async () => {
      jest
        .spyOn(rangesService, 'deleteRange')
        .mockRejectedValue(new NotFoundException('Range with ID non-existent-id not found'));

      await expect(rangesController.deleteRange('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
      await expect(rangesController.deleteRange('non-existent-id')).rejects.toThrow(
        'Range with ID non-existent-id not found',
      );
    });
  });
});
