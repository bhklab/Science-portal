import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { StatsSchema }  from '../schema/stats.schema';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: 'Stats', schema: StatsSchema }])
	],
  controllers: [StatsController], // receieve requests
  providers: [StatsService], // logic for conducting work upon controllers request
})
export class StatsModule {}
