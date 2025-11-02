import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RangesService } from './ranges.service';
import { RangesController } from './ranges.controller';
import { Range, RangeSchema } from './schemas';
import { TexasSolverService } from './texas-solver.service';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Range.name, schema: RangeSchema }]), ConfigModule],
  controllers: [RangesController],
  providers: [RangesService, TexasSolverService],
  exports: [RangesService, TexasSolverService],
})
export class RangesModule {}
