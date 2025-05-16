import { Schema } from 'mongoose';

export const PublicationsNewSchema = new Schema({
	PMID: Number,
	doi: { type: String, required: true },
	date: String,
	name: { type: String, required: true },
	journal: String,
	type: String,
	authors: String,
	filteredAuthors: String,
	affiliations: String,
	citations: Number,
	dateAdded: String,
	publisher: String,
	status: String,
	image: String,
	supplementary: {
		code: {},
		data: {},
		containers: {},
		results: {},
		trials: {},
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
	submitter: String
}, { collection: 'newpublications' });
