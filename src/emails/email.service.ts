import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';
import { AuthorDocument } from '../interfaces/author.interface';
import { PublicationDocument } from 'src/interfaces/publication.interface';
import { stat } from 'fs';

@Injectable()
export class EmailService {
    constructor(
		@InjectModel('Author') private AuthorModel: Model<AuthorDocument>,
      	@InjectModel('Publication') private publicationModel: Model<PublicationDocument>
	) {}
	
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

	async sendFanout(pub: PublicationDocument, verdict: boolean) {
        try {
			if (verdict) {
				const response = axios.post('http://127.0.0.1:8000/email/fanout', pub)
				try {
					await this.publicationModel.updateOne(
						{ doi: pub.doi },
						{ $set: { 
							fanout: {
								request: true,
								completed: true,
								verdict: true,
							}}
						}
					).exec();
				} catch (error) {
					console.log(error);
					return {status: 500, message: `Database fanout update error: ${error}`};
				}
			} else {
				try {
					await this.publicationModel.updateOne(
						{ doi: pub.doi },
						{ $set: { 
							fanout: {
								request: true,
								completed: true,
								verdict: false,
							}}
						}
					).exec();
					return {status: 200, message: "Successful decline of fanout email."}
				} catch (error) {
					console.log(error);
					return {status: 500, message: `Database fanout update error: ${error}`};
				}
			}
        } catch (error) {
            console.log(error);
			return {status: 500, message: `Email fanout error: ${error}`};
        }

		return {status: 200, message: "Emails are currently being sent out, thank you!"}
    }
}
