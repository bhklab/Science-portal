// publication.interface.ts or within your publication.schema.ts
import { Document } from 'mongoose';

export interface AuthorDocument extends Document {
  lastName: string;
  firstName: string;
  primaryResearchInstitute: string;
  primaryAppointment: string;
  email: string;
}

