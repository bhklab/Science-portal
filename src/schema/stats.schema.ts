import { Schema } from 'mongoose';

export const StatsSchema = new Schema({
	name: String,
	authors: String,
	date: Date,
	citations: Number,
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
			dataverse: { type: [String] },
			openScienceFramework: { type: [String] },
			finngenGitbook: { type: [String] },
			gtexPortal: { type: [String] },
			ebiAcUk: { type: [String] },
			mendeley: { type: [String] },
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
}
}, { collection: 'publications' });

StatsSchema.index(
  { authors: 1, name: 1 },
  { collation: { locale: 'en', strength: 2 } }
);
