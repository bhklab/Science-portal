import { Document } from 'mongoose';

export interface PublicationDocument extends Document {
	PMID: number;
	doi: string;
	summary: string;
	date: string;
	name: string;
	journal: string;
	type: string;
	abstract: string;
	authors: string;
	filteredAuthors: string;
	affiliations: string[];
	citations: number;
	dateAdded: Date;
	publisher: string;
	status: string;
	image: string;
	scraped?: boolean;
    fanout?: {
        request: boolean;
        completed: boolean;
		verdict: boolean;
    };
	supplementary: {
		code?: {};
		data?: {};
		containers?: {};
		results?: {};
		trials?: {};
		protocols?: {}
		packages?: {};
		miscellaneous?: {};
	};
	submitter?: string;
}

