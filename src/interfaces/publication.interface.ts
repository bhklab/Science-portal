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
	code?: {
		github?: string[];
		gitlab?: string[];
	};
	data?: {
		geo?: string[];
		dbGap?: string[];
		kaggle?: string[];
		dryad?: string[];
		empiar?: string[];
		gigaDb?: string[];
		zenodo?: string[];
		ega?: string[];
		xlsx?: string[];
		csv?: string[];
		proteinDataBank?: string[];
		dataverse: { type: [String] },
		openScienceFramework: { type: [String] },
		finngenGitbook: { type: [String] },
		gtexPortal: { type: [String] },
		ebiAcUk: { type: [String] },
		mendeley: { type: [String] },
		R?: string[];
	};
	containers?: {
		codeOcean?: string[];
		colab?: string[];
	};
	results?: {
		gsea?: string[];
		figshare?: string[];
	};
	trials?: {
		clinicalTrial?: string[];
	};
	packages?: {
		bioconductor?: string[];
		pypi?: string[];
		CRAN?: string[];
	};
	miscellaneous?: {
		IEEE?: string[];
		pdf?: string[];
		docx?: string[];
		zip?: string[];
	};
  };
}

