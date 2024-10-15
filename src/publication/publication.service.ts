// publication.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PublicationDocument } from '../interfaces/publication.interface';
import { PublicationChangesDocument } from '../interfaces/publication-changes.interface';

@Injectable()
export class PublicationService {
	constructor(
	  @InjectModel('Publication') private publicationModel: Model<PublicationDocument>,
	  @InjectModel('PublicationChanges') private publicationChangesModel: Model<PublicationChangesDocument>,
	  @InjectModel('PublicationsNew') private readonly publicationsNewModel: Model<PublicationDocument>,
	) {}
	

	//Get select publications based on criteria
    async findSelectPublications(total: number, sort: string, lab: string, name: string): Promise<PublicationDocument[]> {
        try {
			let query = {};
			if (lab != '' && name != '') {
				query = {
					authors: { $regex: new RegExp(lab, 'i') },
					name: { $regex: new RegExp (name, 'i') }
				};
			} else if (lab != '') {
				query = {
					authors: { $regex: new RegExp(lab, 'i') }
				};
			} else if (name != '') {
				query = {
					name: { $regex: new RegExp (name, 'i') }
				};
			}
			
			let sortOption = {};
			switch (sort) {
				case 'A-Z':
					sortOption = { name: 1 };
					break;
				case 'Z-A':
					sortOption = { name: -1 };
					break;
				case 'Most Recent':
					sortOption = { date: -1 };
					break;
				case 'Least Recent':
					sortOption = { date: 1 };
					break;
				case 'Most Citations':
					sortOption = { citations: -1 };
					break;
				case 'Least Citations':
					sortOption = { citations: 1 };
					break;
			}
		
			// console.log(sortOption);
			const publications = await this.publicationModel
				.find(query)
				.collation({ locale: 'en', strength: 2 })
				.sort(sortOption)
				.limit(total);
			
			return publications;

        } catch (error) {
            throw new Error(`Error fetching: ${error}`);
        }
    }

	async findByDoi(doi: string): Promise<PublicationDocument> {
        try {
            const publication = await this.publicationModel.findOne({ doi }).exec();
            if (!publication) {
                throw new Error('Publication not found');
            }
            return publication;
        } catch (error) {
            throw new Error(`Error fetching publication by DOI: ${error}`);
        }
    }

	async savePublicationChanges(pub: PublicationChangesDocument): Promise<PublicationChangesDocument> {
		const newChange = new this.publicationChangesModel(pub);
		return await newChange.save();
	}

	async createPublication(newPub: PublicationDocument): Promise<PublicationDocument> {
		const createdPublication = new this.publicationsNewModel(newPub);
		return await createdPublication.save();
	}
	
}
