import { Document } from 'mongoose';

export interface PublicationChangesDocument extends Document {
	PMID: number;
	doi: string;
	date: string;
	name: string;
	journal: string;
	type: string;
	authors: string;
	filteredAuthors: string;
	affiliations: string[];
	citations: number;
	dateAdded: Date;
	publisher: string;
	status: string;
	image: string;
    supplementary: {
        code?: Record<string, string[]>;
        data?: Record<string, string[]>;
        containers?: Record<string, string[]>;
        results?: Record<string, string[]>;
        trials?: Record<string, string[]>;
        protocols?: Record<string, string[]>;
        packages?: Record<string, string[]>;
        miscellaneous?: Record<string, string[]>;
    };
	otherLinks: {
        name: string;
        description: string;
		recommendedCategory: string;
        link: string;
    }[];
	originalId: string;
	SubmittterEmail: string;	
	merged: boolean;
}