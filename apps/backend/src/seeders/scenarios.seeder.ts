import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { Logger } from '@nestjs/common';
import { ScenariosService } from '../scenarios/scenarios.service';
import * as fs from 'fs';
import * as path from 'path';
import { CreateScenarioDto } from '../scenarios/dtos/create-scenario.dto';
import { ConflictException } from '@nestjs/common';

async function seed() {
  const logger = new Logger('ScenarioSeeder');
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  try {
    const scenariosService = app.get(ScenariosService);

    // Load scenarios from JSON file
    const scenariosPath = path.join(__dirname, 'data', 'scenarios.json');
    const scenariosData = JSON.parse(fs.readFileSync(scenariosPath, 'utf8'));

    logger.log(`Found ${scenariosData.length} scenarios to seed`);

    let createdCount = 0;
    let skippedCount = 0;

    for (const scenarioData of scenariosData) {
      try {
        const createDto: CreateScenarioDto = scenarioData as CreateScenarioDto;
        await scenariosService.create(createDto);
        createdCount++;
        logger.log(`✓ Created scenario: ${createDto.name}`);
      } catch (error) {
        if (error instanceof ConflictException) {
          skippedCount++;
          logger.warn(`⊘ Skipped (already exists): ${scenarioData.name}`);
        } else {
          logger.error(`✗ Failed to create scenario: ${scenarioData.name}`, error);
          throw error;
        }
      }
    }

    logger.log(`\nSeeding completed:`);
    logger.log(`  - Created: ${createdCount}`);
    logger.log(`  - Skipped: ${skippedCount}`);
    logger.log(`  - Total: ${scenariosData.length}`);
  } catch (err) {
    logger.error('Seeding failed', err as Error);
    process.exitCode = 1;
  } finally {
    await app.close();
  }
}

seed();
