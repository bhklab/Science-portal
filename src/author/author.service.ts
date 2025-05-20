// publication.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthorDocument } from '../interfaces/author.interface';

@Injectable()
export class AuthorService {
    constructor(@InjectModel('Author') private AuthorModel: Model<AuthorDocument>){}
    //Get all authors/scientist
    async findAllAuthors() {
        try {
            const authors = await this.AuthorModel.find({}).exec();
            if (!authors) {
                throw new Error('Authors not found');
            }
                return authors.sort((a, b) => a.lastName.localeCompare(b.lastName));
            } catch (error) {
            throw new Error(`Error finding all authors: ${(error as Error).message}`);
        }
    }

    // Find a single author/scientist
    async findOneAuthor(email: string) {
        try {
			const author = await this.AuthorModel.findOne({ email: new RegExp(`^${email}$`, 'i') }).exec();
            if (!author) {
                return "Author not found"
            }
            return author;
        } catch (error) {
            console.log(error)
            throw new Error(`Error fetching single author: ${(error as Error).message}`);
        }
    }

    
}
