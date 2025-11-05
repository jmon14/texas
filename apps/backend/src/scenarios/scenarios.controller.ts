import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ScenariosService } from './scenarios.service';
import { ScenarioResponseDto, CreateScenarioDto } from './dtos';
import { GameType } from './enums/game-type.enum';
import { Difficulty } from './enums/difficulty.enum';
import { Category } from './enums/category.enum';
import JwtAuthGuard from '../auth/guards/jwt-auth.guard';

@ApiTags('scenarios')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('scenarios')
export class ScenariosController {
  constructor(private readonly scenariosService: ScenariosService) {}

  @Get()
  @ApiOperation({ summary: 'Get all scenarios with optional filters' })
  @ApiQuery({
    name: 'gameType',
    enum: GameType,
    required: false,
    description: 'Filter by game type',
  })
  @ApiQuery({
    name: 'difficulty',
    enum: Difficulty,
    required: false,
    description: 'Filter by difficulty level',
  })
  @ApiQuery({
    name: 'category',
    enum: Category,
    required: false,
    description: 'Filter by category',
  })
  @ApiResponse({
    status: 200,
    description: 'Scenarios retrieved successfully.',
    type: [ScenarioResponseDto],
  })
  async getScenarios(
    @Query('gameType') gameType?: GameType,
    @Query('difficulty') difficulty?: Difficulty,
    @Query('category') category?: Category,
  ): Promise<ScenarioResponseDto[]> {
    return this.scenariosService.findAll(gameType, difficulty, category);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a scenario by ID' })
  @ApiResponse({
    status: 200,
    description: 'Scenario retrieved successfully.',
    type: ScenarioResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Scenario not found.' })
  async getScenarioById(@Param('id') id: string): Promise<ScenarioResponseDto> {
    return this.scenariosService.findById(id);
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Get scenarios by category' })
  @ApiResponse({
    status: 200,
    description: 'Scenarios retrieved successfully.',
    type: [ScenarioResponseDto],
  })
  async getScenariosByCategory(
    @Param('category') category: Category,
  ): Promise<ScenarioResponseDto[]> {
    return this.scenariosService.findByCategory(category);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new scenario' })
  @ApiResponse({
    status: 201,
    description: 'Scenario created successfully.',
    type: ScenarioResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Scenario with this name already exists.',
  })
  async createScenario(@Body() createScenarioDto: CreateScenarioDto): Promise<ScenarioResponseDto> {
    return this.scenariosService.create(createScenarioDto);
  }
}
