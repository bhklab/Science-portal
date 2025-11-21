import { Schema } from 'mongoose';

export const PublicationChangesSchema = new Schema({
	PMID: { type: Number },
	doi: { type: String, required: true },
	summary: { type: String},
	date: { type: String },
	name: { type: String },
	journal: { type: String },
	type: { type: String },
	authors: { type: String },
	filteredAuthors: { type: String },
	affiliations: { type: [String] },
	citations: { type: Number },
	dateAdded: { type: Date, default: Date.now },
	publisher: { type: String },
	status: { type: String },
	image: { type: String },
	supplementary: {
		code: {},
		data: {},
		containers: {},
		results: {},
		trials: {},
		protocols: {},
		packages: {},
		miscellaneous: {}
	},
	otherLinks: [
		{
			name: String,
			description: String,
			recommendedCategory: String,
			link: String
		}
	],
	originalId: { type: String },
	submitterEmail: { type: String },
	merged: Boolean
});
