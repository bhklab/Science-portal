import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PublicationController } from './publication.controller';
import { PublicationService } from './publication.service';
import { PublicationSchema } from '../schema/publication.schema';
import { PublicationChangesSchema } from '../schema/publication-changes.schema';
import { PublicationsNewSchema } from '../schema/publication-new.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Publication', schema: PublicationSchema },
      { name: 'PublicationChanges', schema: PublicationChangesSchema },
	  { name: 'PublicationsNew', schema: PublicationsNewSchema },
    ])
  ],
  controllers: [PublicationController],
  providers: [PublicationService],
})
export class PublicationModule {}
