import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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

		newPub.doi = newPub.doi.trim() //Clear off any spaces
		const publication = await this.publicationModel.findOne({ doi: newPub.doi }).exec();
		if (publication) {
			return "DOI exists in database already";
		}

		if (newPub.date === null){
			newPub.date = new Date().toISOString();
		}

		newPub.date = newPub.date.toString().substring(0, 10);
		let scrapedPublication = null;

		const retry_max = 3;
		let retry_count = 0;

		// If not being sent to director, scrape crossref and supplementary data, place results object in preliminary database
		while (retry_count < retry_max) {
			try {
				scrapedPublication = (await axios.post(`${process.env.SCRAPING_API}/scrape/publication/one`, newPub)).data
				break
			} catch (error) {
				console.dir(error, { depth: null, color: true })
				if (retry_count >= 2) return `Scraping error occured. Please try again later. ${error}`
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

		if (newPub.date === null){
			newPub.date = new Date().toISOString();
		}

		newPub.date = newPub.date.toString().substring(0, 10);
		let scrapedPublication = null;

		const retry_max = 3;
		let retry_count = 0;

		// If not being sent to director, scrape crossref and supplementary data, place results object in preliminary database
		if(!newPub.fanout.request){
			while (retry_count < retry_max) {
				try {
					scrapedPublication = (await axios.post(`${process.env.SCRAPING_API}/scrape/publication/one`, newPub)).data
					try {
						await this.publicationsNewModel.create(scrapedPublication)
						delete scrapedPublication.otherLinks;
						await this.publicationModel.create(scrapedPublication);
					} catch (error) {
						console.log(error)
						return  `Database upload error occured. Please try again later. ${error}`
					}
					break
				} catch (error) {
					console.dir(error, { depth: null, color: true })
					if (retry_count >= 2) return `Scraping error occured. Please try again later. ${error}`
				}
				retry_count += 1
			}

		} else { // When being sent to director, scrape publication's crossref and supplementary data, upload to publication database, then send email to director
			while (retry_count < retry_max) {
				try {
					scrapedPublication = (await axios.post(`${process.env.SCRAPING_API}/scrape/publication/one`, newPub)).data

					// If publication scrape and upload is successful + the user requests sending to the director, email director about the new publication
					if (scrapedPublication && newPub.fanout.request && !newPub.fanout.completed) {
						try {
							await axios.post(`${process.env.SCRAPING_API}/email/director`, scrapedPublication)
						} catch (error) {
							console.log(JSON.stringify(error));
							return  `Emailing director error. Please try again later.${error}` 
						}
					}
					try {
						await this.publicationsNewModel.create(scrapedPublication)
						delete scrapedPublication.otherLinks;
						await this.publicationModel.create(scrapedPublication);
					} catch (error) {
						console.log(error)
						return  `Database upload error occured. Please try again later ${error}`
					}
					break
				} catch (error) {
					console.dir(error, { depth: null, color: true })
					if (retry_count >= 2) return `Scraping error occured. Please try again later. ${error}`
				}
				retry_count += 1
			}
		}
		return `${process.env.DOMAIN}/publication/${encodeURIComponent(newPub.doi)}`

    }
}
