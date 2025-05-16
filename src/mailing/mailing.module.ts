import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MailingController } from './mailing.controller';
import { MailingService } from './mailing.service';
import { MailSchema } from '../schema/mailing.schema';
import { LogSchema } from 'src/schema/logs.schema';
import { LoggingService } from '../logging/logs.service';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: 'Mail', schema: MailSchema },
			{ name: 'Logs', schema: LogSchema }
		])
	],
	controllers: [MailingController],
	providers: [MailingService, LoggingService],
})
export class MailingModule {}
