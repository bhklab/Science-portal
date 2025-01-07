// publication.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StatsDocument } from '../interfaces/stats.interface';
import { AuthorDocument } from '../interfaces/author.interface';
import { PublicationDocument } from '../interfaces/publication.interface';
import { AuthorStats } from '../interfaces/author-stats.interface';
import { supplementary } from '../interfaces/link-types'
import { filter } from 'rxjs';

@Injectable()
export class StatsService {
	constructor(
		@InjectModel('Stats') private statsModel: Model<StatsDocument>,
		@InjectModel('Author') private authorModel: Model<AuthorDocument>,
		@InjectModel('Publication') private publicationModel: Model<PublicationDocument>
	){}
	

	async findLabStats(lab: string) {
		console.log(lab);
		const query = {
			authors: { $regex: new RegExp(`\\b${lab}\\b`, 'i') },
		}

		console.log(query);
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

	// Total contributions to each resource category sorted by year
	async findAuthorAnnualSupplementary(email: string) {
		const colors = [
			{ barColour: 'rgba(127, 97, 219, 1)', borderColour: 'rgba(127, 97, 219, 1)' },
			{ barColour: 'rgba(89, 113, 203, 1)', borderColour: 'rgba(89, 113, 203, 1)' },
			{ barColour: 'rgba(89, 170, 106, 1)', borderColour: 'rgba(89, 170, 106, 1)' },
			{ barColour: 'rgba(242, 172, 60, 1)', borderColour: 'rgba(242, 172, 60, 1)' },
			{ barColour: 'rgba(203, 93, 56, 1)', borderColour: 'rgba(203, 93, 56, 1)' },
			{ barColour: 'rgba(68, 152, 145, 1)', borderColour: 'rgba(68, 152, 145, 1)' }
		];
	
		try {
			const author = await this.authorModel.findOne({ email: email }).exec();
	
			if (!author) {
				throw new Error(`Author with email ${email} not found`);
			}

			const query = {
				authors: { $regex: new RegExp(`\\b${author.lastName}, ${author.firstName}\\b`, 'i') },
			}
	
			const publications = await this.statsModel
				.find(query)
				.collation({ locale: 'en', strength: 2 });

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
	
			return { labels, datasets };
		} catch (error) {
			throw new Error(`Error fetching supplementary stats: ${error}`);
		}
	}

	// Author's ranking for contributions to each resource category
	async findPublicationsByAuthor(enid: string | number) {
		try {
			const enidNumber = Number(enid);
	
			// Fetch all authors
			const allAuthors = await this.authorModel.find({}).lean();
			const targetAuthor = allAuthors.find((author) => author.ENID === enidNumber);
			if (!targetAuthor) throw new Error('Author not found');
	
			// Fetch all publications
			const allPublications = await this.publicationModel.find({}).lean();
	
			// Group publications by author
			const publicationsByAuthor = allAuthors.reduce((acc, author) => {
				const authorNamePattern = new RegExp(`${author.lastName}, ${author.firstName}`, 'i');
				acc[author.ENID] = allPublications.filter((pub) => pub.authors.match(authorNamePattern));
				return acc;
			}, {} as Record<number, any[]>);
	
			const totalCategoryContributions = supplementary.reduce((acc, { type }) => {
				if (!acc[type]) acc[type] = 0;
				return acc;
			}, {} as Record<string, number>);
	
			const authorStatsMap: {
				[key: number]: {
					name: string;
					categoryContributions: Record<string, number>;
					totalCitations: number;
				};
			} = {};
	
			// Process publications for each author
			allAuthors.forEach((author) => {
				const publications = publicationsByAuthor[author.ENID] || [];
				const authorStats = {
					name: `${author.firstName} ${author.lastName}`,
					categoryContributions: supplementary.reduce((acc, { type }) => {
						if (!acc[type]) acc[type] = 0;
						return acc;
					}, {} as Record<string, number>),
					totalCitations: 0,
				};
	
				publications.forEach((pub) => {
					authorStats.totalCitations += pub.citations || 0;
	
					// Process supplementary links
					supplementary.forEach(({ dbName, type }) => {
						if (pub.supplementary?.[dbName]) {
							const links = pub.supplementary[dbName]
								.split(',')
								.map((link) => link.trim())
								.filter((link) => link);
							if (links.length > 0) {
								authorStats.categoryContributions[type] += 1;
								totalCategoryContributions[type] += 1;
							}
						}
					});
				});
	
				authorStatsMap[author.ENID] = authorStats;
			});
	
			// Calculate rankings
			const categoryRankings: { [key: string]: any[] } = {};
			supplementary.forEach(({ type }) => {
				if (!categoryRankings[type]) {
					const sortedAuthors = Object.entries(authorStatsMap)
						.map(([enid, stats]) => ({
							enid: Number(enid),
							name: stats.name,
							totalCitations: stats.totalCitations,
							contributions: stats.categoryContributions[type],
						}))
						.sort((a, b) => b.contributions - a.contributions);
	
					categoryRankings[type] = sortedAuthors.map((author, index) => ({
						...author,
						rank: index + 1,
					}));
				}
			});
	
			// Format for scatter plot rankings
			const platformRankings = supplementary.reduce((acc, { type }) => {
				acc[type] = categoryRankings[type].map((entry) => ({
					enid: entry.enid,
					name: entry.enid === enidNumber ? entry.name : 'Anonymous',
					contributions: entry.contributions,
					rank: entry.rank,
				}));
				return acc;
			}, {} as Record<string, any[]>);
	
			// Prepare category stats for target author
			const targetAuthorStats = authorStatsMap[enidNumber];
			if (!targetAuthorStats) throw new Error('Author has no contributions');
	
			const categoryStats = supplementary.reduce((acc, { type }) => {
				const authorRank = categoryRankings[type].findIndex((author) => author.enid === enidNumber) + 1;
				const totalAuthors = categoryRankings[type].length;
				const rankPercentage = Math.ceil((authorRank / totalAuthors) * 100);
				const openSciencePercentage = Math.ceil(
					(targetAuthorStats.categoryContributions[type] /
						(publicationsByAuthor[enidNumber]?.length || 1)) *
						100
				);
	
				acc[type] = {
					total: totalCategoryContributions[type],
					authorContributions: targetAuthorStats.categoryContributions[type],
					rank: authorRank,
					percentage: rankPercentage,
					openSciencePercentage,
				};
	
				return acc;
			}, {} as Record<string, any>);
	
			return {
				author: targetAuthorStats.name,
				authorEmail: targetAuthor.email,
				totalCitations: targetAuthorStats.totalCitations,
				totalPublications: publicationsByAuthor[enidNumber]?.length || 0,
				categoryStats,
				platformRankings,
			};
		} catch (error) {
			throw new Error(
				`Error fetching publications for author: ${error instanceof Error ? error.message : 'Unknown error'}`
			);
		}
	}	
}
