// publication.interface.ts or within your publication.schema.ts
import { Document } from 'mongoose';

export interface PublicationDocument extends Document {
  PMID: number;
  doi: string;
  date: string;
  name: string;
  journal: string;
  type: string;
  authors: string;
  affiliations: string;
  image: string;
  citations: number;
  status: string;
  repoLinks: {
    codeOcean: string;
    github: string;
    dggap: string;
    GEO: string;
    EGA: string;
    protocols: string;
    other: string;
  };
}
