import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import  { AuthorSchema }  from '../schema/author.schema';

@Module({
    imports: [
		MongooseModule.forFeature([{ name: 'Author', schema: AuthorSchema }])
	],
    controllers: [EmailController], // receieve requests
    providers: [EmailService], // logic for conducting work upon controllers request
})
export class EmailModule {}
