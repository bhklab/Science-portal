import { Schema } from 'mongoose';

export const PublicationSchema = new Schema({
	PMID: Number,
	doi: String,
	date: String,
	name: String,
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
	scraped: Boolean,
	fanout: {
		request: Boolean,
		completed: Boolean,
	},
	supplementary: {
		code: {},
		data: {},
		containers: {},
		results: {},
		trials: {},
		packages: {},
		miscellaneous: {}
	}
}, { collection: 'publications' });

PublicationSchema.index(
  { authors: 1, name: 1 },
  { collation: { locale: 'en', strength: 2 } }
);
