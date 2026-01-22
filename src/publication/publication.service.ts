import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Storage } from '@google-cloud/storage';
import { PublicationDocument } from '../interfaces/publication.interface';
import { PublicationChangesDocument } from '../interfaces/publication-changes.interface';
import { PublicationDocumentNew } from 'src/interfaces/publication-new.interface';
import axios from 'axios'
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class PublicationService {
    constructor(
      @InjectModel('Publication') private publicationModel: Model<PublicationDocument>,
      @InjectModel('PublicationChanges') private publicationChangesModel: Model<PublicationChangesDocument>,
      @InjectModel('PublicationsNew') private publicationsNewModel: Model<PublicationDocumentNew>,
    ) {}

	// Creates a client
	private readonly storage = new Storage();   
	private readonly bucketName = 'publication_pdfs' 

    //Get select publications based on criteria
    async findSelectPublications(
        total: number,
        sort: string,
        lab: string,
        resources: string[],
        search: string
    ): Promise<PublicationDocument[]> {
        try {
            let query: any = {};
            
            // Build base query
            if (lab !== '' && search !== '') {
                query = {
                    $text: { $search: search },
                    authors: { $regex: new RegExp(lab, 'i') }
                };
            } else if (lab !== '') {
                query = {
                    authors: { $regex: new RegExp(lab, 'i') }
                };
            } else if (search !== '') {
                query = {
                    $text: { $search: search }
                };
            }

            // Handle supplementary resource filtering
            if (resources && resources.length > 0) {
            const andConditions: any[] = [];
            const subfieldCache: Record<string, string[]> = {};

            for (const category of resources) {
                const catKey = category.toLowerCase();
                const subfields = subfieldCache[catKey] || await this.getSupplementarySubfields(catKey);
                subfieldCache[catKey] = subfields;

                const orConditions = subfields.map(sub => ({
                    [`supplementary.${catKey}.${sub}`]: { $exists: true, $ne: [] }
                }));

                if (orConditions.length > 0) {
                    andConditions.push({ $or: orConditions });
                }
            }

            if (andConditions.length > 0) {
                query = {
                    $and: [query, ...andConditions]
                };
            }
            }

            // Sorting
            let sortOption: any = {};
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

            if (search !== '') {
            	sortOption['score'] = { $meta: 'textScore' };
            }

            // Query database
            const publications = await this.publicationModel
            .find(
                query,
                search !== '' ? { score: { $meta: 'textScore' } } : {}
            )
            .collation({ locale: 'en', strength: 2 })
            .sort(sortOption)
            .limit(total);

            return publications;

        } catch (error) {
            throw new Error(`selecting publication error ${error}`);
        }
    }


    private async getSupplementarySubfields(category: string): Promise<string[]> {
        const sample = await this.publicationModel
            .findOne({ [`supplementary.${category}`]: { $exists: true } })
            .lean();

        if (sample && sample.supplementary && sample.supplementary[category]) {
            return Object.keys(sample.supplementary[category]);
        }

        return [];
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
    async fetchPublication(newPub: PublicationDocumentNew): Promise<any> {

		newPub.doi = newPub.doi.trim() //Clear off white space
		const publication = await this.publicationModel.findOne({ doi: newPub.doi }).exec();
		if (publication) {
			return "DOI exists in database already";
		}

		let scrapedPublication = null;

		const retry_max = 5;
		let retry_count = 0;

		while (retry_count < retry_max) {
			try {
				scrapedPublication = (await axios.post(`${process.env.SCRAPING_API}/scrape/publication/one`, newPub)).data
				break
			} catch (error) {
				console.log(error)
				// console.dir(error, { depth: null, color: true })
				if (retry_count >= 4){
					if (axios.isAxiosError(error) && error.response?.data?.detail === "Crossref Error: 404: Not Found"){
						return `${error.status}: DOI not recognizable`
					}
					else {
						return `Scraping error occured. Please try again later. ${error}`
					}
				}
				
			}
			retry_count += 1
		}
		return scrapedPublication
    }
	
	async createPublication(newPub: PublicationDocumentNew): Promise<any> {

		newPub.doi = newPub.doi.trim() //Clear off any spaces
		const publication = await this.publicationModel.findOne({ doi: newPub.doi }).exec();
		if (publication) {
			return "DOI exists in database already";
		}

		if(!newPub.fanout.request){ 
			try {
				await this.publicationsNewModel.create(newPub)
				delete newPub.otherLinks;
				await this.publicationModel.create(newPub);
			} catch (error) {
				console.log(error)
				return  `Database upload error occured. Please try again later. ${error}`
			}
		}
		else {

			if (newPub && newPub.fanout.request && !newPub.fanout.completed) {
				try {
					await axios.post(`${process.env.SCRAPING_API}/email/director`, newPub)
				} catch (error) {
					console.log(JSON.stringify(error));
					return  `Emailing director error. Please try again later.${error}` 
				}
			}

			try {
				await this.publicationsNewModel.create(newPub)
				delete newPub.otherLinks;
				await this.publicationModel.create(newPub);
			} catch (error) {
				console.log(error)
				return  `Database upload error occured. Please try again later. ${error}`
			}

			
		}

		return `${process.env.DOMAIN}/publication/${encodeURIComponent(newPub.doi)}`

    }

	async uploadPublicationPDF(pdf: Express.Multer.File): Promise<any> {

		if (!pdf?.buffer) {
			throw new Error(`Did not recieve pdf`);
		}

		const fileName = pdf.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
		let bucket = null
		let file = null

		try {
			
			bucket = this.storage.bucket(this.bucketName)
			file = bucket.file(fileName)

			const [fileExists] = await file.exists() // list of duplicate files (if they exist)
			
			if (fileExists) {// Ensure no duplicate publication names exist in the database
				throw new Error(`pdf names exists already, please rename and resubmit`);
			}

			await file.save(pdf.buffer, {
				contentType: pdf.mimetype || 'application/pdf',
				resumable: false,
				metadata: {
					metadata: {
						originalName: pdf.originalname,
						uploadedAt: new Date().toISOString(),
					},
						
				},
			});

		} catch (error) {
			console.log(error);
			throw new Error(`Unsuccessful pdf upload: ${(error as Error).message}`);
		}

		

		return 'Successful pdf upload!';
	}

}
