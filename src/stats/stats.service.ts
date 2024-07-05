// publication.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StatsDocument } from '../interfaces/stats.interface';

@Injectable()
export class StatsService {
    constructor(@InjectModel('Stats') private statsModel: Model<StatsDocument>){}

	async findLabStats(lab: string) {
		const query = {
			authors: { $regex: new RegExp(lab, 'i') },
		}
        try {
			const publications = await this.statsModel
				.find(query)
				.collation({ locale: 'en', strength: 2 });
			const totalCitations = publications.reduce((acc, pub) => acc + pub.citations, 0)

			return {publications: publications.length, citations: totalCitations};
        } catch (error) {
            throw new Error(`Error fetching lab stats: ${error}`);
        }
    }

	async findAllSupplementary() {
		try {
			const publications = await this.statsModel.find({})
        } catch (error) {
            throw new Error(`Error fetching: ${error}`);
        }

		let supplementary = ['github', 'codeOcean', 'geo', 'dbGap', 'figshare', 'kaggle', 'dryad', 'empiar', 'gigaDb',
			'dataverse', 'IEEE', 'mendeley', 'openScienceFramework', 'zenodo', 'gitlab', 'finngenGitbook', 'pdf',
			'docx', 'clinicalTrial', 'ega', 'zip', 'xlsx', 'gtexPortal', 'proteinDataBank', 'ebiAcUk', 'gsea'
		];

		for (const item of supplementary){

		} 
    }
	
}
