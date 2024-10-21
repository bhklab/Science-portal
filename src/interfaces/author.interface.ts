import { Document } from 'mongoose';

export interface AuthorDocument extends Document {
	ENID: number;
	lastName: string;
	firstName: string;
	primaryResearchInstitute: string;
	primaryAppointment: string;
	email: string;
}

