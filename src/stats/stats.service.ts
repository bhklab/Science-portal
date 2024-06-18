// publication.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PublicationDocument } from '../interfaces/publication.interface';

@Injectable()
export class StatsService {
    constructor(@InjectModel('Stats') private StatsModel: Model<PublicationDocument>){}
	async findAllAuthors() {
        try {
            const authors = await this.StatsModel.find({}).exec();
            if (!authors) {
                throw new Error('No publications found');
            }
            return authors;
        } catch (error) {
            throw new Error(`Error fetching publication by DOI: ${error}`);
        }
    }
	
}
