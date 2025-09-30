import { Document } from 'mongoose';


export interface UserDocument extends Document {
    _id: any;
	firstName: string;
	lastName: string;
	email: string;
	admin: boolean;
}
