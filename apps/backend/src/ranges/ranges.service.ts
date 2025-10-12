import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Range, RangeDocument } from './schemas';
import { CreateRangeDto, UpdateRangeDto, RangeResponseDto } from './dtos';

@Injectable()
export class RangesService {
  constructor(@InjectModel(Range.name) private rangeModel: Model<RangeDocument>) {}

  async saveRange(createRangeDto: CreateRangeDto): Promise<RangeResponseDto> {
    // Check if user has reached the limit of 10 ranges (matching Vision logic)
    const userRanges = await this.rangeModel.find({ userId: createRangeDto.userId }).exec();
    if (userRanges.length >= 10) {
      throw new BadRequestException('User has reached the maximum limit of 10 ranges');
    }

    const createdRange = new this.rangeModel(createRangeDto);
    const savedRange = await createdRange.save();
    return savedRange.toObject();
  }

  async getAllRanges(): Promise<RangeResponseDto[]> {
    const ranges = await this.rangeModel.find().exec();
    return ranges.map((range) => range.toObject());
  }

  async getRangesByUserId(userId: string): Promise<RangeResponseDto[]> {
    const ranges = await this.rangeModel.find({ userId }).exec();
    return ranges.map((range) => range.toObject());
  }

  async getRangeById(id: string): Promise<RangeResponseDto> {
    const range = await this.rangeModel.findById(id).exec();
    if (!range) {
      throw new NotFoundException(`Range with ID ${id} not found`);
    }
    return range.toObject();
  }

  async updateRange(id: string, updateRangeDto: UpdateRangeDto): Promise<RangeResponseDto> {
    const updatedRange = await this.rangeModel
      .findByIdAndUpdate(id, updateRangeDto, { new: true })
      .exec();
    if (!updatedRange) {
      throw new NotFoundException(`Range with ID ${id} not found`);
    }
    return updatedRange.toObject();
  }

  async deleteRange(id: string): Promise<void> {
    const result = await this.rangeModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Range with ID ${id} not found`);
    }
  }
}
