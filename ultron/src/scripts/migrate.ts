import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

async function run() {
  const logger = new Logger('MigrationRunner');
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
  try {
    const dataSource = app.get(DataSource);
    logger.log('Running pending database migrations...');
    const results = await dataSource.runMigrations();
    results.forEach((r) => logger.log(`Executed migration: ${r.name}`));
    logger.log('Migrations completed');
  } catch (err) {
    logger.error('Migration failed', err as Error);
    process.exitCode = 1;
  } finally {
    await app.close();
  }
}

run();
