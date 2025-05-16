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
    async findSelectPublications(total: number, sort: string, lab: string, resources: string [], search: string): Promise<PublicationDocument[]> {
		try {
			let query = {};
			if (lab != '' && search != '') {
				query = {
					$text: {$search: search},
					authors: { $regex: new RegExp(lab, 'i') },
				};
			} else if (lab != '') {
				query = {
					authors: { $regex: new RegExp(lab, 'i') }
				};
			} else if (search != '') {
				query = {
					$text: {$search: search},
				};
			}

			if (resources && resources.length > 0) {
				const andConditions: any[] = [];

				for (const category of resources) {
					const catKey = category.toLowerCase();

					const dynamicCondition = {
						[`supplementary.${catKey}`]: {
							$exists: true,
							$ne: {} // ensure the section is not empty
						}
					};

					andConditions.push(dynamicCondition);
				}

				if (andConditions.length > 0) {
					query = {
						$and: [query, ...andConditions]
					};
				}

			
			}			
			
			let sortOption = {};
			switch (sort) {
				case 'A-Z':
					sortOption['name'] = 1;
					break;
				case 'Z-A':
					sortOption['name'] = -1;
					break;
				case 'Most Recent':
					sortOption['date'] = -1;
					break;
				case 'Least Recent':
					sortOption['date'] = 1;
					break;
				case 'Most Citations':
					sortOption['citations'] = -1;

					break;
				case 'Least Citations':
					sortOption['citations'] = 1;
					break;
			}

			if (search != ''){
				sortOption['score'] = { $meta: 'textScore' };
			}
		
			const publications = await this.publicationModel
				.find(
					query,
					search != '' ? { score: { $meta: 'textScore' } } : {}
				)
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
		console.log(pub);
		const newChange = new this.publicationChangesModel({...pub, merged: false});
		return await newChange.save();
	}

	async createPublication(newPub: PublicationDocument): Promise<PublicationDocument> {
		if (newPub.date === null){
			newPub.date = "";
		}
		const pub = {...newPub, date: newPub.date.toString().substring(0, 10)};
		const createdPublication = new this.publicationsNewModel(pub);
		return await createdPublication.save();
	}
	
}
