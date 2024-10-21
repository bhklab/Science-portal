import { Schema } from 'mongoose';

export const AuthorSchema = new Schema({
    ENID: { type: Number, required: true },
    lastName: { type: String, required: true },
    firstName: { type: String, required: true },
    primaryResearchInstitute: { type: String },
    primaryAppointment: { type: String },
    email: { type: String },
}, { collection: 'authors' });

