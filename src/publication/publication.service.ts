// publication.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PublicationDocument } from '../interfaces/publication.interface';

@Injectable()
export class PublicationService {
    constructor(@InjectModel('Publication') private publicationModel: Model<PublicationDocument>) {}

    async findAll(): Promise<PublicationDocument[]> {
        try {
            const publications = await this.publicationModel.find().exec();
            console.log(publications);
            return publications;
        } catch (error) {
            throw new Error(`Error fetching: ${error}`);
        }
    }
}
