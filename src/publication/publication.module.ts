import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PublicationController } from './publication.controller';
import { PublicationService } from './publication.service';
import  { PublicationSchema }  from '../schema/publication.schema';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: 'Publication', schema: PublicationSchema }])
	],
  controllers: [PublicationController], // receieve requests
  providers: [PublicationService], // logic for conducting work upon controllers request
})
export class PublicationModule {}
