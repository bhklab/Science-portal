import { Document } from 'mongoose';

export interface MailingDocument extends Document {
	email: string
	mailOptIn: boolean
}

