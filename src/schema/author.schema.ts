import { Schema } from 'mongoose';

export const AuthorSchema = new Schema({
  	lastName: String,
  	firstName: String,
  	primaryResearchInstitute: String,
  	primaryAppointment: String,
  	email: String,
}, { collection: 'authors' });

