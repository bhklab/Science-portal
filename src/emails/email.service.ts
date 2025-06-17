import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthorDocument } from '../interfaces/author.interface';

@Injectable()
export class EmailService {
    constructor(@InjectModel('Author') private AuthorModel: Model<AuthorDocument>){}
	
	async findAllEmails() {
        try {
            const emails = await this.AuthorModel.find({}, 'email').exec();
            if (!emails) {
                throw new Error('Emails not found');
            }
            return emails.map(email => email.email);
        } catch (error) {
            throw new Error(`Error fetching emails`);
        }
    }

	async getFanout() {
        try {
            return process.env.FANOUT_EMAILS;
        } catch (error) {
            throw new Error(`Error fetching emails`);
        }
    }
}
