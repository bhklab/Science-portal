import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthorController } from './author.controller';
import { AuthorService } from './author.service';
import  { AuthorSchema }  from '../schema/author.schema';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: 'Author', schema: AuthorSchema }])
	],
  controllers: [AuthorController], // receieve requests
  providers: [AuthorService], // logic for conducting work upon controllers request
})
export class AuthorModule {}
