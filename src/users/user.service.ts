import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from '../interfaces/user.interface';

@Injectable()
export class UserService {
    constructor(
		@InjectModel('User') private UserModel: Model<UserDocument>,
	) {}
	
	async getAdminEmails() {
        try {
            const users = await this.UserModel.find({ "admin" : true});
            if (!users) {
                throw new Error('Users not found');
            }
            return users.map(user => user.email);
        } catch (error) {
            throw new Error(`Error fetching users`);
        }
    }
}
