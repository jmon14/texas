import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScenariosService } from './scenarios.service';
import { ScenariosController } from './scenarios.controller';
import { ReferenceRangesService } from './reference-ranges.service';
import { ReferenceRangesImportService } from './reference-ranges-import.service';
import { StandardRangesService } from './standard-ranges.service';
import { ReferenceRangesController } from './reference-ranges.controller';
import { RangeComparisonService } from './range-comparison.service';
import {
  Scenario,
  ScenarioSchema,
  ReferenceRange,
  ReferenceRangeSchema,
  UserRangeAttempt,
  UserRangeAttemptSchema,
} from './schemas';
import { ConfigModule } from '../config/config.module';
import { RangesModule } from '../ranges/ranges.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Scenario.name, schema: ScenarioSchema },
      { name: ReferenceRange.name, schema: ReferenceRangeSchema },
      { name: UserRangeAttempt.name, schema: UserRangeAttemptSchema },
    ]),
    ConfigModule,
    RangesModule,
  ],
  controllers: [ScenariosController, ReferenceRangesController],
  providers: [
    ScenariosService,
    ReferenceRangesService,
    ReferenceRangesImportService,
    StandardRangesService,
    RangeComparisonService,
  ],
  exports: [
    ScenariosService,
    ReferenceRangesService,
    ReferenceRangesImportService,
    RangeComparisonService,
  ],
})
export class ScenariosModule {}
