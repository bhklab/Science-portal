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
		const supplementary = [
			{ dbName: 'github', displayName: 'Github' },
			{ dbName: 'codeOcean', displayName: 'Code Ocean' },
			{ dbName: 'geo', displayName: 'Gene Expression Omnibus (Geo)' },
			{ dbName: 'dbGap', displayName: 'Database of Genotypes and Phenotypes (dbGap)' },
			{ dbName: 'figshare', displayName: 'Figshare' },
			{ dbName: 'kaggle', displayName: 'Kaggle' },
			{ dbName: 'dryad', displayName: 'Dryad' },
			{ dbName: 'empiar', displayName: 'Empiar' },
			{ dbName: 'gigaDb', displayName: 'GigaScience Database (gigaDb)' },
			{ dbName: 'dataverse', displayName: 'Dataverse' },
			{ dbName: 'IEEE', displayName: 'IEEE' },
			{ dbName: 'mendeley', displayName: 'Mendeley' },
			{ dbName: 'openScienceframework', displayName: 'Open Science Framework (OSF)' },
			{ dbName: 'zenodo', displayName: 'Zenodo' },
			{ dbName: 'gitlab', displayName: 'Gitlab' },
			{ dbName: 'finngenGitbook', displayName: 'Finngen' },
			{ dbName: 'pdf', displayName: 'PDF' },
			{ dbName: 'docx', displayName: 'Word Document (docx)' },
			{ dbName: 'clinicalTrial', displayName: 'Clinical Trial Gov' },
			{ dbName: 'ega', displayName: 'European Genome-phenome Archive (EGA)' },
			{ dbName: 'zip', displayName: 'Compressed Folder (zip)' },
			{ dbName: 'xlsx', displayName: 'Excel Document (xlsx)' },
			{ dbName: 'csv', displayName: 'Comma Separated Values File (csv)' },
			{ dbName: 'gtexPortal', displayName: 'Genotype-Tissue Expression (GTEx)' },
			{ dbName: 'proteinDataBank', displayName: 'Protein Data Bank (PDB)' },
			{ dbName: 'ebiAcUk', displayName: 'EMBLs European Bioinformatics Institute' },
			{ dbName: 'gsea', displayName: 'Gene Set Enrichment Analysis (GSEA)' }
		];
	
		const colors = [
			{ barColour: 'rgba(255,99,132,0.5)', borderColour: 'rgba(255,99,132,1)' },
			{ barColour: 'rgba(54,162,235,0.5)', borderColour: 'rgba(54,162,235,1)' },
			{ barColour: 'rgba(75,192,192,0.5)', borderColour: 'rgba(75,192,192,1)' },
			{ barColour: 'rgba(87, 82, 209, 0.5)', borderColour: 'rgba(87, 82, 209, 1)' },
			{ barColour: 'rgba(239, 146, 52, 0.5)', borderColour: 'rgba(239, 146, 52, 1)' }
		];
	
		try {
			const publications = await this.statsModel.find({});
			
			// Filter publications for those with dates from 2022 onwards
			const filteredPublications = publications.filter(pub => new Date(pub.date) >= new Date('2022-01-02'));
	
			// Logging filtered publications to ensure data is being filtered correctly
			console.log('Filtered Publications:', filteredPublications.length);
	
			const yearData = {};
	
			filteredPublications.forEach(pub => {
				const year = new Date(pub.date).getFullYear();
				if (!yearData[year]) {
					yearData[year] = supplementary.reduce((acc, { dbName }) => ({ ...acc, [dbName]: 0 }), {});
				}
	
				supplementary.forEach(({ dbName }) => {
					if (pub.supplementary[dbName]) {
						const links = pub.supplementary[dbName].split(',').map(link => link.trim()).filter(link => link);
						yearData[year][dbName] += links.length;
					}
				});
			});
	
			// Logging yearData to see the processed data
			console.log('Year Data:', JSON.stringify(yearData, null, 2));
	
			const labels = Object.keys(yearData).sort();
			const datasets = supplementary.map(({ dbName, displayName }, index) => {
				const colorIndex = index % colors.length;
				return {
					label: displayName,
					data: labels.map(year => yearData[year][dbName]),
					backgroundColor: colors[colorIndex].barColour,
					borderColor: colors[colorIndex].borderColour,
					borderWidth: 1
				};
			});
	
			console.log(JSON.stringify({ labels, datasets }, null, 1));
	
			return { labels, datasets };
		} catch (error) {
			throw new Error(`Error fetching supplementary stats: ${error}`);
		}
	}
		
	
}
