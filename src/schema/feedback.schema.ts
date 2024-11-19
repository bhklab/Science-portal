import { Schema } from 'mongoose';

export const FeedbackSchema = new Schema({
    subject: String,
	message: String,
	email: String,
}, { collection: 'feedback' });

