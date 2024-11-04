import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import  { AuthorSchema }  from '../schema/author.schema';

@Module({
    imports: [
		MongooseModule.forFeature([{ name: 'Author', schema: AuthorSchema }])
	],
    controllers: [EmailController],
    providers: [EmailService],
})
export class EmailModule {}
