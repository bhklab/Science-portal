import { Document } from 'mongoose';

export interface PublicationDocument extends Document {
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
  supplementary: {
	code?: {};
	data?: {};
	containers?: {};
	results?: {};
	trials?: {};
	packages?: {};
	miscellaneous?: {};
  };
  submitter?: string;
}

