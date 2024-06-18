import { Schema } from 'mongoose';

export const StatsSchema = new Schema({
  name: String,
  citations: Number,
  supplementary: {
    github: { type: String, default: "" },
    codeOcean: { type: String, default: "" },
    geo: { type: String, default: "" },
    dbGap: { type: String, default: "" },
    figshare: { type: String, default: "" },
    kaggle: { type: String, default: "" },
    dryad: { type: String, default: "" },
    empiar: { type: String, default: "" },
    gigaDb: { type: String, default: "" },
    dataverse: { type: String, default: "" },
    IEEE: { type: String, default: "" },
    mendeley: { type: String, default: "" },
    openScienceframework: { type: String, default: "" },
    zenodo: { type: String, default: "" },
    gitlab: { type: String, default: "" },
    finngenGitbook: { type: String, default: "" },
    pdf: { type: String, default: "" },
    docx: { type: String, default: "" },
    clinicalTrial: { type: String, default: "" },
    ega: { type: String, default: "" },
    zip: { type: String, default: "" },
    xlsx: { type: String, default: "" },
    csv: { type: String, default: "" },
    gtexPortal: { type: String, default: "" },
    proteinDataBank: { type: String, default: "" },
    ebiAcUk: { type: String, default: "" },
    gsea: { type: String, default: "" },
  },
}, { collection: 'publications' });

StatsSchema.index(
  { authors: 1, name: 1 },
  { collation: { locale: 'en', strength: 2 } }
);
