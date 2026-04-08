import { Schema } from 'mongoose';

export const LogSchema = new Schema({
	type: String,
    email: String ,
	timestamp: Date,
	doi: String,
	searchCriteria: {
		search: String,
		lab: String,
		sort: String,
		resources: [String]
	}
}, { collection: 'logs' });

