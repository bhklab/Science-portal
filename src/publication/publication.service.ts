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
				const resourceMap: Record<string, string[]> = {
					code: ['github', 'gitlab'],
					data: ['geo',	'dbGap', 'kaggle', 'dryad', 'empiar', 'gigaDb',	'zenodo', 'ega', 'xlsx', 'csv',
						'proteinDataBank', 'dataverse', 'openScienceFramework', 'finngenGitbook', 'gtexPortal',	'ebiAcUk',
						'mendeley',	'R'
					],
					containers: ['codeOcean', 'colab'],
					results: ['gsea', 'figshare'],
					trials: ['clinicalTrial'],
					packages: ['bioconductor', 'pypi', 'CRAN'],
					miscellaneous: ['IEEE', 'pdf', 'docx', 'zip']
				};
		  
				const orConditions: any[] = [];
		  
				// For each selected resource category, add conditions for each subcategory
				for (const category of resources) {
					const catKey = category.toLowerCase();
					if (resourceMap[catKey]) {
						resourceMap[catKey].forEach((subCat) => {
							const path = `supplementary.${catKey}.${subCat}.0`;
							orConditions.push({ [path]: { $exists: true } });
						});
					}
				}
		  
				if (orConditions.length > 0) {
					query = {
						$and: [query, { $or: orConditions }]
					};
				}
			}
			
			
			let sortOption = {};
			switch (sort) {
				case 'A-Z':
					sortOption = {
						name: 1,
					};
					break;
				case 'Z-A':
					sortOption = {
						name: -1,
					};
					break;
				case 'Most Recent':
					sortOption = { 
						date: -1,
					};
					break;
				case 'Least Recent':
					sortOption = { 
						date: 1,
					};
					break;
				case 'Most Citations':
					sortOption = { 
						citations: -1,
					};
					break;
				case 'Least Citations':
					sortOption = { 
						citations: 1,
					};
					break;
			}
			sortOption['score'] = ({ $meta: 'textScore' })
		
			const publications = await this.publicationModel
				.find(
					query,
					{
						score: { $meta: 'textScore' } 
					}
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
		const newChange = new this.publicationChangesModel(pub);
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
