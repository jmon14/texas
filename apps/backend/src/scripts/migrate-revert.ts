import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

async function run() {
  const logger = new Logger('MigrationRevert');
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
  try {
    const dataSource = app.get(DataSource);
    logger.log('Reverting last migration...');
    await dataSource.undoLastMigration();
    logger.log('Revert completed');
  } catch (err) {
    logger.error('Revert failed', err as Error);
    process.exitCode = 1;
  } finally {
    await app.close();
  }
}

run();
