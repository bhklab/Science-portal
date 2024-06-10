// publication.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthorDocument } from '../interfaces/author.interface';

@Injectable()
export class AuthorService {
    constructor(@InjectModel('Author') private AuthorModel: Model<AuthorDocument>){}
	//Get all Authors/Scientists
	async findAllAuthors() {
        try {
            const authors = await this.AuthorModel.find({}).exec();
            if (!authors) {
                throw new Error('Authors not found');
            }
            return authors;
        } catch (error) {
            throw new Error(`Error fetching publication by DOI: ${error}`);
        }
    }
	
}
