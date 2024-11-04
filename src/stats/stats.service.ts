// publication.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StatsDocument } from '../interfaces/stats.interface';
import { AuthorDocument } from '../interfaces/author.interface';
import { PublicationDocument } from '../interfaces/publication.interface';
import { AuthorStats } from '../interfaces/author-stats.interface'; // Import the interface

@Injectable()
export class StatsService {
    constructor(
		@InjectModel('Stats') private statsModel: Model<StatsDocument>,
		@InjectModel('Author') private authorModel: Model<AuthorDocument>,
		@InjectModel('Publication') private publicationModel: Model<PublicationDocument>
	){}
	

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
			{ barColour: 'rgba(127, 97, 219, 1)', borderColour: 'rgba(127, 97, 219, 1)' },
			{ barColour: 'rgba(89, 113, 203, 1)', borderColour: 'rgba(89, 113, 203, 1)' },
			{ barColour: 'rgba(89, 170, 106, 1)', borderColour: 'rgba(89, 170, 106, 1)' },
			{ barColour: 'rgba(242, 172, 60, 1)', borderColour: 'rgba(242, 172, 60, 1)' },
			{ barColour: 'rgba(203, 93, 56, 1)', borderColour: 'rgba(203, 93, 56, 1)' },
			{ barColour: 'rgba(68, 152, 145, 1)', borderColour: 'rgba(68, 152, 145, 1)' }
		];
	
		try {
            const publications = await this.statsModel.find({});
            
            // Filter publications for those with dates from 2018 onwards
            const filteredPublications = publications.filter(pub => new Date(pub.date) >= new Date('2018-01-02'));
    
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
            // console.log('Year Data:', JSON.stringify(yearData, null, 2));
    
            const labels = Object.keys(yearData).sort();
            const uniqueTypes = [...new Set(supplementary.map(({ type }) => type))];
            const datasets = uniqueTypes.map((type, index) => {
                const colorIndex = index % colors.length;
                return {
                    label: type,
                    data: labels.map(year => yearData[year][type]),
                    backgroundColor: colors[colorIndex].barColour,
                    borderColor: colors[colorIndex].borderColour,
                    borderWidth: 0,
					maxBarThickness: 100
                };
            });
    
            // console.log(JSON.stringify({ labels, datasets }, null, 1));
    
            return { labels, datasets };
        } catch (error) {
            throw new Error(`Error fetching supplementary stats: ${error}`);
        }
	}

	async findPublicationsByAuthor(enid: string | number) {
		try {
			const enidNumber = Number(enid);
			const allAuthors = await this.authorModel.find({});
	
			const LINK_CATEGORIES = {
				code: ['github', 'gitlab'],
				data: ['geo', 'dbGap', 'kaggle', 'dryad', 'empiar', 'gigaDb', 'zenodo', 'ega', 'xlsx', 'csv', 'proteinDataBank'],
				containers: ['codeOcean', 'colab'],
				results: ['gsea', 'figshare'],
				trials: ['clinicalTrial'],
				miscellaneous: ['IEEE', 'pdf', 'docx', 'zip']
			};
	
			const authorStatsMap: { [key: number]: Omit<AuthorStats, '_id'> } = {};
			const categoryRankings: { [key: string]: [number, Omit<AuthorStats, '_id'>][] } = {};
	
			const totalCategoryContributions = {
				code: 0,
				data: 0,
				containers: 0,
				results: 0,
				trials: 0,
				miscellaneous: 0
			};
	
			let totalPublicationsForAuthor = 0;
			let totalPublicationsForSystem = 0;
			let authorEmail = '';
	
			for (const author of allAuthors) {
				const namePattern = `${author.lastName}, ${author.firstName}`;
				const publications = await this.publicationModel.find({
					authors: { $regex: new RegExp(namePattern, 'i') }
				});
	
				if (author.ENID === enidNumber) {
					totalPublicationsForAuthor = publications.length;
					authorEmail = author.email;
				}
	
				totalPublicationsForSystem += publications.length;
	
				authorStatsMap[author.ENID] = {
					name: `${author.firstName} ${author.lastName}`,
					totalValidLinks: 0,
					citations: 0,
					categoryContributions: {
						code: 0,
						data: 0,
						containers: 0,
						results: 0,
						trials: 0,
						miscellaneous: 0
					}
				};
	
				publications.forEach(pub => {
					let hasCategoryLink = {
						code: false,
						data: false,
						containers: false,
						results: false,
						trials: false,
						miscellaneous: false
					};
	
					Object.keys(pub.supplementary).forEach(key => {
						if (pub.supplementary[key] && pub.supplementary[key] !== "") {
							for (const [category, keys] of Object.entries(LINK_CATEGORIES)) {
								if (keys.includes(key) && !hasCategoryLink[category]) {
									hasCategoryLink[category] = true;
									authorStatsMap[author.ENID].categoryContributions[category]++;
									totalCategoryContributions[category]++;
								}
							}
						}
					});
	
					authorStatsMap[author.ENID].citations += pub.citations || 0;
				});
			}
	
			Object.keys(LINK_CATEGORIES).forEach(category => {
				const sortedAuthors: [number, Omit<AuthorStats, '_id'>][] = Object.entries(authorStatsMap)
					.map(([authorIdStr, stats]) => [Number(authorIdStr), stats as Omit<AuthorStats, '_id'>] as [number, Omit<AuthorStats, '_id'>])
					.sort(([, a], [, b]) => b.categoryContributions[category] - a.categoryContributions[category]);
				categoryRankings[category] = sortedAuthors;
			});
	
			const authorStats = authorStatsMap[enidNumber];
			if (!authorStats) {
				throw new Error('Author not found');
			}
	
			const rankings = {};
			const categoryStats = {};
	
			Object.keys(LINK_CATEGORIES).forEach(category => {
				const sortedAuthors = categoryRankings[category];
				const authorRank = sortedAuthors.findIndex(([authorId]) => authorId === enidNumber) + 1;
				const totalAuthors = sortedAuthors.length;
				const rankPercentage = Math.ceil((authorRank / totalAuthors) * 100);
				const openSciencePercentage = Math.ceil((authorStats.categoryContributions[category] / totalPublicationsForAuthor) * 100 )
	
				categoryStats[category] = {
					total: totalCategoryContributions[category],
					authorContributions: authorStats.categoryContributions[category],
					rank: authorRank,
					percentage: rankPercentage,
					openSciencePercentage: openSciencePercentage
				};
	
				rankings[category] = {
					rank: authorRank,
					totalAuthors,
					rankPercentage
				};
			});
	
			return {
				author: authorStats.name,
				authorEmail,
				totalValidLinks: authorStats.totalValidLinks,
				totalCitations: authorStats.citations,
				categoryStats,
				rankings,
				totalPublications: totalPublicationsForAuthor,
				totalSystemPublications: totalPublicationsForSystem
			};
	
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(`Error fetching publications for author: ${error.message}`);
			} else {
				throw new Error('Unknown error occurred');
			}
		}
	}
	
	
	
	
}
