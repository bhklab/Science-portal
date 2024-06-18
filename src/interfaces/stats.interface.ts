// publication.interface.ts or within your publication.schema.ts
import { Document } from 'mongoose';

export interface StatDocument extends Document {
  lastName: string;
  firstName: string;
  primaryResearchInstitute: string;
  primaryAppointment: string;
  email: string;
}

