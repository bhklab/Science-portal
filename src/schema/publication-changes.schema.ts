import { Schema } from 'mongoose';

export const PublicationChangesSchema = new Schema({
  PMID: { type: Number }, // or { type: String }, depending on your preference
  doi: { type: String, required: true },
  date: { type: String },
  name: { type: String },
  journal: { type: String },
  type: { type: String },
  authors: { type: String },
  filteredAuthors: { type: String },
  affiliations: { type: String },
  citations: { type: Number },
  dateAdded: { type: Date, default: Date.now },
  publisher: { type: String },
  status: { type: String },
  image: { type: String },

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
  },

  otherLinks: [
    {
      name: String,
      description: String,
      link: String
    }
  ],
  originalId: { type: String },
  submitterEmail: { type: String }
});
