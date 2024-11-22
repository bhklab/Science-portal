import { Document } from 'mongoose';

export interface StatsDocument extends Document {
  name: string;
  authors: string;
  date: Date;
  citations: number;
  supplementary: {
    github: string;
    codeOcean: string;
    geo: string;
    dbGap: string;
    figshare: string;
    kaggle: string;
    dryad: string;
    empiar: string;
    gigaDb: string;
    dataverse: string;
    IEEE: string;
    mendeley: string;
    openScienceframework: string;
    zenodo: string;
    gitlab: string;
    finngenGitbook: string;
    pdf: string;
    docx: string;
    clinicalTrial: string;
    ega: string;
    zip: string;
    xlsx: string;
    csv: string;
    gtexPortal: string;
    proteinDataBank: string;
    ebiAcUk: string;
    gsea: string;
  };
}

