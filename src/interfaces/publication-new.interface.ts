import { Document } from 'mongoose';

export interface PublicationDocumentNew extends Document {
	PMID: number;
	doi: string;
	date: string;
	name: string;
	journal: string;
	type: string;
	authors: string;
	filteredAuthors: string;
	affiliations: string;
	citations: number;
	dateAdded: string;
	publisher: string;
	status: string;
	image: string;
	scraped: boolean;
	fanout: {
		request: boolean,
		completed: boolean
	}
	supplementary: {
		code?: {};
		data?: {};
		containers?: {};
		results?: {};
		trials?: {};
		packages?: {};
		miscellaneous?: {};
	};
	otherLinks: {};
	submitter?: string;
}

