import { Schema } from 'mongoose';

export const MailSchema = new Schema({
    email: { type: String },
	mailOptIn: {type: Boolean}

}, { collection: 'emailinglist' });

