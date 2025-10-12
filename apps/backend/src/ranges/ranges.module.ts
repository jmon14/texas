import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RangesService } from './ranges.service';
import { RangesController } from './ranges.controller';
import { Range, RangeSchema } from './schemas';

@Module({
  imports: [MongooseModule.forFeature([{ name: Range.name, schema: RangeSchema }])],
  controllers: [RangesController],
  providers: [RangesService],
  exports: [RangesService],
})
export class RangesModule {}
