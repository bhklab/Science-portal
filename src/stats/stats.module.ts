import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { StatsSchema }  from '../schema/stats.schema';
import { AuthorSchema }  from '../schema/author.schema';
import { UserSchema } from 'src/schema/user.schema';
import { PublicationSchema }  from '../schema/publication.schema';
import { LogSchema } from 'src/schema/logs.schema';
import { LoggingService } from '../logging/logs.service';


@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: 'Stats', schema: StatsSchema },
			{ name: 'Author', schema: AuthorSchema },
			{ name: 'Publication', schema: PublicationSchema },
			{ name: 'Logs', schema: LogSchema},
			{ name: 'Users', schema: UserSchema}
		])
	],
	controllers: [StatsController], 
	providers: [StatsService, LoggingService],
})
export class StatsModule {}
