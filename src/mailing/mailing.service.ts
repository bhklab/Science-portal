// publication.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MailingDocument } from '../interfaces/mailing.interface';

@Injectable()
export class MailingService {
    constructor(@InjectModel('Mail') private MailModel: Model<MailingDocument>){}

	// Get a mailing status for an email
    async mailStatus(email: string) {
        try {
            const mail = await this.MailModel.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
            if (!mail) {
				await this.MailModel.create({ email: email, mailOptIn: true });
				return true
            }
            return mail.mailOptIn;
        } catch (error) {
            throw new Error(`Error updating mailOptIn: ${(error as Error).message}`);
        }
    }

    // Update a mailing status for a user
	async updateMailOptIn(email: string, mailOptIn: boolean) {
		try {
			
			await this.MailModel.updateOne(
				{ email: { $regex: new RegExp(`^${email}$`, 'i') } },
				{ $set: { mailOptIn: !mailOptIn } }
			);

			return !mailOptIn;
			
		} catch (error) {
			throw new Error(`Error updating mailOptIn: ${(error as Error).message}`);
		}
	}


    
}
