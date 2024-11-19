import { Document } from 'mongoose';

export interface FeedbackDocument extends Document {
	subject: string,
	message: string,
	email: string,
}

