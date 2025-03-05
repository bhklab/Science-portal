import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PublicationController } from './publication.controller';
import { PublicationService } from './publication.service';
import { PublicationSchema } from '../schema/publication.schema';
import { PublicationChangesSchema } from '../schema/publication-changes.schema';
import { PublicationsNewSchema } from '../schema/publication-new.schema';
import { LogSchema } from 'src/schema/logs.schema';
import { LoggingService } from '../logging/logs.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Publication', schema: PublicationSchema },
      { name: 'PublicationChanges', schema: PublicationChangesSchema },
	  { name: 'PublicationsNew', schema: PublicationsNewSchema },
	  { name: 'Logs', schema: LogSchema }
    ])
  ],
  controllers: [PublicationController],
  providers: [PublicationService, LoggingService],
})
export class PublicationModule {}
