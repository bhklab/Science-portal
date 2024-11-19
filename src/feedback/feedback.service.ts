import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FeedbackDocument } from '../interfaces/feedback.interface';

@Injectable()
export class FeedbackService {
    constructor(@InjectModel('Feedback') private FeedbackModel: Model<FeedbackDocument>){}
	
	async submitFeedback(feedback: FeedbackDocument) {
        try {
            const submit = new this.FeedbackModel(feedback);
			const res = await submit.save();
			return await submit.save();
        } catch (error) {
            throw new Error(`Error fetching emails`);
        }
    }
}
