import { Schema } from 'mongoose';

export const UserSchema = new Schema({
    firstName: {type: String},
	lastName: {type: String},
	email: { type: String },
	admin: {type: Boolean }
}, { collection: 'users' });

