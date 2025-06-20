import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import  { AuthorSchema }  from '../schema/author.schema';
import { PublicationSchema } from 'src/schema/publication.schema';

@Module({
    imports: [
		MongooseModule.forFeature([
			{ name: 'Author', schema: AuthorSchema },
			{ name: 'Publication', schema: PublicationSchema }
		])
	],
    controllers: [EmailController],
    providers: [EmailService],
})
export class EmailModule {}
