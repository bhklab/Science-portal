import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LogStats } from 'src/interfaces/logs.interface';

@Injectable()
export class LoggingService {
	constructor(
		@InjectModel('Logs') private readonly logModel: Model<LogStats>
	) {}

	async logAction(type: string, email: string, doi: string | null, searchCriteria: {}): Promise<void> {
		try {
			const logEntry = new this.logModel({ type, email, timestamp: new Date(), doi, searchCriteria });
			await logEntry.save();
		} catch (error) {
			console.error('Error logging action:', error);
		}
	}
}