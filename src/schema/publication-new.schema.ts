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
		code: {
		github: { type: [String] },
		gitlab: { type: [String] }
		},
		data: {
		geo: { type: [String] },
		dbGap: { type: [String] },
		kaggle: { type: [String] },
		dryad: { type: [String] },
		empiar: { type: [String] },
		gigaDb: { type: [String] },
		zenodo: { type: [String] },
		ega: { type: [String] },
		xlsx: { type: [String] },
		csv: { type: [String] },
		proteinDataBank: { type: [String] },
		R: { type: [String] }
		},
		containers: {
		codeOcean: { type: [String] },
		colab: { type: [String] }
		},
		results: {
		gsea: { type: [String] },
		figshare: { type: [String] }
		},
		trials: {
		clinicalTrial: { type: [String] }
		},
		packages: {
		bioconductor: { type: [String] },
		pypi: { type: [String] },
		CRAN: { type: [String] }
		},
		miscellaneous: {
		IEEE: { type: [String] },
		pdf: { type: [String] },
		docx: { type: [String] },
		zip: { type: [String] }
		}
	},

	otherLinks: [
		{
		name: String,
		description: String,
		link: String
		}
  ],
}, { collection: 'newpublications' });
