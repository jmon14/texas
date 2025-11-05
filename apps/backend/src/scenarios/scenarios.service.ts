import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Scenario, ScenarioDocument } from './schemas';
import { ScenarioResponseDto, CreateScenarioDto } from './dtos';
import { GameType } from './enums/game-type.enum';
import { Difficulty } from './enums/difficulty.enum';
import { Category } from './enums/category.enum';

@Injectable()
export class ScenariosService {
  constructor(@InjectModel(Scenario.name) private scenarioModel: Model<ScenarioDocument>) {}

  async findAll(
    gameType?: GameType,
    difficulty?: Difficulty,
    category?: Category,
  ): Promise<ScenarioResponseDto[]> {
    const filter: any = {};

    if (gameType) {
      filter.gameType = gameType;
    }

    if (difficulty) {
      filter.difficulty = difficulty;
    }

    if (category) {
      filter.category = category;
    }

    const scenarios = await this.scenarioModel.find(filter).exec();
    return scenarios.map((scenario) => scenario.toObject());
  }

  async findById(id: string): Promise<ScenarioResponseDto> {
    const scenario = await this.scenarioModel.findById(id).exec();
    if (!scenario) {
      throw new NotFoundException(`Scenario with ID ${id} not found`);
    }
    return scenario.toObject();
  }

  async findByCategory(category: Category): Promise<ScenarioResponseDto[]> {
    const scenarios = await this.scenarioModel.find({ category }).exec();
    return scenarios.map((scenario) => scenario.toObject());
  }

  async create(createScenarioDto: CreateScenarioDto): Promise<ScenarioResponseDto> {
    // Check if scenario with same name already exists (for idempotency)
    const existingScenario = await this.scenarioModel
      .findOne({ name: createScenarioDto.name })
      .exec();
    if (existingScenario) {
      throw new ConflictException(`Scenario with name "${createScenarioDto.name}" already exists`);
    }

    const scenario = new this.scenarioModel(createScenarioDto);
    const savedScenario = await scenario.save();
    return savedScenario.toObject();
  }
}
