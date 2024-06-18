import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { PublicationSchema }  from '../schema/publication.schema';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: 'Publication', schema: PublicationSchema }])
	],
  controllers: [StatsController], // receieve requests
  providers: [StatsService], // logic for conducting work upon controllers request
})
export class StatsModule {}
