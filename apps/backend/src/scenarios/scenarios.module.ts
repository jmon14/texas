import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScenariosService } from './scenarios.service';
import { ScenariosController } from './scenarios.controller';
import {
  Scenario,
  ScenarioSchema,
  ReferenceRange,
  ReferenceRangeSchema,
  UserRangeAttempt,
  UserRangeAttemptSchema,
} from './schemas';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Scenario.name, schema: ScenarioSchema },
      { name: ReferenceRange.name, schema: ReferenceRangeSchema },
      { name: UserRangeAttempt.name, schema: UserRangeAttemptSchema },
    ]),
    ConfigModule,
  ],
  controllers: [ScenariosController],
  providers: [ScenariosService],
  exports: [ScenariosService],
})
export class ScenariosModule {}
