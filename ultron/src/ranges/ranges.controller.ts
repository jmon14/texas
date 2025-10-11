import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RangesService } from './ranges.service';
import { CreateRangeDto, UpdateRangeDto } from './dtos';
import JwtAuthGuard from '../auth/guards/jwt-auth.guard';

@ApiTags('ranges')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ranges')
export class RangesController {
  constructor(private readonly rangesService: RangesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all ranges' })
  @ApiResponse({ status: 200, description: 'Ranges retrieved successfully.' })
  async getRanges() {
    return this.rangesService.getAllRanges();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get ranges by user ID' })
  @ApiResponse({ status: 200, description: 'Ranges retrieved successfully.' })
  async getRangesByUserId(@Param('userId') userId: string) {
    return this.rangesService.getRangesByUserId(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new range' })
  @ApiResponse({ status: 201, description: 'Range created successfully.' })
  @ApiResponse({ status: 400, description: 'User has reached the maximum limit of 10 ranges.' })
  async createRange(@Body() createRangeDto: CreateRangeDto) {
    try {
      await this.rangesService.saveRange(createRangeDto);
      return 'Range created successfully';
    } catch (error) {
      if (error.message?.includes('maximum limit')) {
        throw error;
      }
      return 'Failed to create range';
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a range by ID' })
  @ApiResponse({ status: 200, description: 'Range retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Range not found.' })
  async getRangeById(@Param('id') id: string) {
    return this.rangesService.getRangeById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a range' })
  @ApiResponse({ status: 200, description: 'Range updated successfully.' })
  @ApiResponse({ status: 404, description: 'Range not found.' })
  async updateRange(@Param('id') id: string, @Body() updateRangeDto: UpdateRangeDto) {
    try {
      await this.rangesService.updateRange(id, updateRangeDto);
      return 'Range updated successfully';
    } catch (error) {
      return 'Failed to update range';
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a range' })
  @ApiResponse({ status: 200, description: 'Range deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Range not found.' })
  async deleteRange(@Param('id') id: string) {
    try {
      await this.rangesService.deleteRange(id);
      return 'Range deleted successfully';
    } catch (error) {
      return 'Failed to delete range';
    }
  }
}
