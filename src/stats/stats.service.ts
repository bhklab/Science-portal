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
			{ dbName: 'github', displayName: 'Github', type: 'Code' },
			{ dbName: 'gitlab', displayName: 'Gitlab', type: 'Code' },
			{ dbName: 'codeOcean', displayName: 'Code Ocean', type: 'Container' },
			{ dbName: 'colab', displayName: 'Code Ocean', type: 'Container' },
			{ dbName: 'geo', displayName: 'Gene Expression Omnibus (Geo)', type: 'Data' },
			{ dbName: 'dbGap', displayName: 'Database of Genotypes and Phenotypes (dbGap)', type: 'Data' },
			{ dbName: 'kaggle', displayName: 'Kaggle', type: 'Data' },
			{ dbName: 'dryad', displayName: 'Dryad', type: 'Data' },
			{ dbName: 'empiar', displayName: 'Empiar', type: 'Data' },
			{ dbName: 'gigaDb', displayName: 'GigaScience Database (gigaDb)', type: 'Data' },
			{ dbName: 'zenodo', displayName: 'Zenodo', type: 'Data' }, 
			{ dbName: 'ega', displayName: 'European Genome-phenome Archive (EGA)', type: 'Data' },
			{ dbName: 'xlsx', displayName: 'Excel Document (xlsx)', type: 'Data' },
			{ dbName: 'csv', displayName: 'Comma Separated Values File (csv)', type: 'Data' },
			{ dbName: 'proteinDataBank', displayName: 'Protein Data Bank (PDB)', type: 'Data' },
			{ dbName: 'dataverse', displayName: 'Dataverse', type: 'Data' },
			{ dbName: 'openScienceframework', displayName: 'Open Science Framework (OSF)', type: 'Data' },
			{ dbName: 'finngenGitbook', displayName: 'Finngen', type: 'Data' },
			{ dbName: 'gtexPortal', displayName: 'Genotype-Tissue Expression (GTEx)', type: 'Data' },
			{ dbName: 'ebiAcUk', displayName: 'EMBLs European Bioinformatics Institute', type: 'Data' },
			{ dbName: 'mendeley', displayName: 'Mendeley', type: 'Data' },
			{ dbName: 'gsea', displayName: 'Gene Set Enrichment Analysis (GSEA)', type: 'Results' },
			{ dbName: 'figshare', displayName: 'Figshare', type: 'Results' },
			{ dbName: 'clinicalTrial', displayName: 'Clinical Trial Gov', type: 'Clinical Trials' },
			// { dbName: 'IEEE', displayName: 'IEEE', type: 'Miscellanous' },
			// { dbName: 'pdf', displayName: 'PDF', type: 'Miscellanous' },
			// { dbName: 'docx', displayName: 'Word Document (docx)', type: 'Miscellanous' },
			// { dbName: 'zip', displayName: 'Compressed Folder (zip)', type: 'Miscellanous' },
		];
	
		const colors = [
			{ barColour: 'rgba(255,99,132,0.5)', borderColour: 'rgba(255,99,132,1)' },
			{ barColour: 'rgba(54,162,235,0.5)', borderColour: 'rgba(54,162,235,1)' },
			{ barColour: 'rgba(75,192,192,0.5)', borderColour: 'rgba(75,192,192,1)' },
			// { barColour: 'rgba(220, 20, 60, 0.5)', borderColour: 'rgba(220, 20, 60, 1)' },
			{ barColour: 'rgba(239, 146, 52, 0.5)', borderColour: 'rgba(239, 146, 52, 1)' },
			{ barColour: 'rgba(148, 103, 189, 0.5)', borderColour: 'rgba(148, 103, 189, 1)' },
			{ barColour: 'rgba(124, 252, 0, 0.5)', borderColour: 'rgba(124, 252, 0, 1)' }
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
                    yearData[year] = supplementary.reduce((acc, { type }) => ({ ...acc, [type]: 0 }), {});
                }
    
                supplementary.forEach(({ dbName, type }) => {
                    if (pub.supplementary[dbName]) {
                        const links = pub.supplementary[dbName].split(',').map(link => link.trim()).filter(link => link);
                        yearData[year][type] += links.length;
                    }
                });
            });
    
            // Logging yearData to see the processed data
            console.log('Year Data:', JSON.stringify(yearData, null, 2));
    
            const labels = Object.keys(yearData).sort();
            const uniqueTypes = [...new Set(supplementary.map(({ type }) => type))];
            const datasets = uniqueTypes.map((type, index) => {
                const colorIndex = index % colors.length;
                return {
                    label: type,
                    data: labels.map(year => yearData[year][type]),
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
