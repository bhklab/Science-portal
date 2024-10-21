import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { StatsSchema }  from '../schema/stats.schema';
import { AuthorSchema }  from '../schema/author.schema';
import { PublicationSchema }  from '../schema/publication.schema';


@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: 'Stats', schema: StatsSchema },
			{name: 'Author', schema: AuthorSchema},
			{name: 'Publication', schema: PublicationSchema}
		])
	],
  controllers: [StatsController], // receieve requests
  providers: [StatsService], // logic for conducting work upon controllers request
})
export class StatsModule {}
