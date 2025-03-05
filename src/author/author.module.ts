import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthorController } from './author.controller';
import { AuthorService } from './author.service';
import  { AuthorSchema }  from '../schema/author.schema';
import { LogSchema } from 'src/schema/logs.schema';
import { LoggingService } from '../logging/logs.service';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: 'Author', schema: AuthorSchema },
			{ name: 'Logs', schema: LogSchema }
		])
	],
  controllers: [AuthorController],
  providers: [AuthorService, LoggingService],
})
export class AuthorModule {}
