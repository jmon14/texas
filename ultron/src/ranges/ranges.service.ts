import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Range, RangeDocument } from './schemas';
import { CreateRangeDto, UpdateRangeDto } from './dtos';
import { RangeResponse } from './interfaces/range-response.interface';

@Injectable()
export class RangesService {
  constructor(@InjectModel(Range.name) private rangeModel: Model<RangeDocument>) {}

  private mapDtoToDocument(dto: CreateRangeDto | UpdateRangeDto): any {
    return {
      name: dto.name,
      hands_range: dto.handsRange,
      user_id: dto.userId,
    };
  }

  private transformToResponse(doc: any): RangeResponse {
    // Ensure action types are lowercase in handsRange
    const transformedHandsRange = doc.hands_range?.map((handRange: any) => ({
      ...handRange,
      actions: handRange.actions?.map((action: any) => ({
        ...action,
        type: action.type ? action.type.toLowerCase() : action.type,
      })),
    }));

    return {
      id: doc._id.toString(),
      name: doc.name,
      handsRange: transformedHandsRange || doc.hands_range,
      userId: doc.user_id,
    };
  }

  async saveRange(createRangeDto: CreateRangeDto): Promise<RangeResponse> {
    // Check if user has reached the limit of 10 ranges (matching Vision logic)
    const userRanges = await this.rangeModel.find({ user_id: createRangeDto.userId }).exec();
    if (userRanges.length >= 10) {
      throw new BadRequestException('User has reached the maximum limit of 10 ranges');
    }

    const mappedData = this.mapDtoToDocument(createRangeDto);
    const createdRange = new this.rangeModel(mappedData);
    const savedRange = await createdRange.save();
    return savedRange.toJSON();
  }

  async getAllRanges(): Promise<RangeResponse[]> {
    const ranges = await this.rangeModel.find().lean().exec();
    return ranges.map((range) => this.transformToResponse(range));
  }

  async getRangesByUserId(userId: string): Promise<RangeResponse[]> {
    const ranges = await this.rangeModel.find({ user_id: userId }).lean().exec();
    return ranges.map((range) => this.transformToResponse(range));
  }

  async getRangeById(id: string): Promise<RangeResponse> {
    const range = await this.rangeModel.findById(id).lean().exec();
    if (!range) {
      throw new NotFoundException(`Range with ID ${id} not found`);
    }
    return this.transformToResponse(range);
  }

  async updateRange(id: string, updateRangeDto: UpdateRangeDto): Promise<RangeResponse> {
    const mappedData = this.mapDtoToDocument(updateRangeDto);
    const updatedRange = await this.rangeModel
      .findByIdAndUpdate(id, mappedData, { new: true })
      .lean()
      .exec();
    if (!updatedRange) {
      throw new NotFoundException(`Range with ID ${id} not found`);
    }
    return this.transformToResponse(updatedRange);
  }

  async deleteRange(id: string): Promise<void> {
    const result = await this.rangeModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Range with ID ${id} not found`);
    }
  }
}
