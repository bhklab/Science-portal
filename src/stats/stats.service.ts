// publication.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StatsDocument } from '../interfaces/stats.interface';
import { AuthorDocument } from '../interfaces/author.interface';
import { PublicationDocument } from '../interfaces/publication.interface';
import { supplementary } from '../interfaces/link-types';
import { AuthorSupplementaryLinks } from 'src/interfaces/author-supplementary-list.interface';

@Injectable()
export class StatsService {
  constructor(
    @InjectModel('Stats') private statsModel: Model<StatsDocument>,
    @InjectModel('Author') private authorModel: Model<AuthorDocument>,
    @InjectModel('Publication') private publicationModel: Model<PublicationDocument>,
  ) {}

  	colours = [
		{ barColour: 'rgba(127, 97, 219, 1)', borderColour: 'rgba(127, 97, 219, 1)' },
		{ barColour: 'rgba(89, 113, 203, 1)', borderColour: 'rgba(89, 113, 203, 1)' },
		{ barColour: 'rgba(242, 172, 60, 1)', borderColour: 'rgba(242, 172, 60, 1)' },
		{ barColour: 'rgba(89, 170, 106, 1)', borderColour: 'rgba(89, 170, 106, 1)' },
		{ barColour: 'rgba(203, 93, 56, 1)', borderColour: 'rgba(203, 93, 56, 1)' },
		{ barColour: 'rgba(112, 191, 202, 1)', borderColour: 'rgba(112, 191, 202, 1)' },
		{ barColour: 'rgba(68, 152, 145, 1)', borderColour: 'rgba(68, 152, 145, 1)' },
	];

	async findLabStats(lab: string) {
		const query = {
			authors: { $regex: new RegExp(`\\b${lab}\\b`, 'i') },
		}

		try {
		const publications = await this.statsModel
			.find(query)
			.collation({ locale: 'en', strength: 2 });
		const totalCitations = publications.reduce(
			(acc, pub) => acc + (pub.citations || 0),
			0,
		);

		return { publications: publications.length, citations: totalCitations };
		} catch (error) {
			throw new Error(`Error fetching lab stats: ${error}`);
		}
	}

	async findAllSupplementary() {
		try {
			const publications = await this.statsModel.find({});
			// Filter for 2018 and onwards
			const filteredPublications = publications.filter(
				(pub) => new Date(pub.date) >= new Date('2018-01-01'),
			);

			const yearData: Record<
				number,
				Record<string, number>
			> = {};

			filteredPublications.forEach((pub) => {

				const year = new Date(pub.date).getFullYear();

				// Initialize counters for each 'type' if needed
				if (!yearData[year]) {
					yearData[year] = {};
					supplementary.forEach(({ type }) => {
						yearData[year][type] = 0;
					});
				}

				let categoryTypes = new Set()

				// For each possible (category, subCategory, type)
				supplementary.forEach(({ category, subCategory, type }) => {
					const linkArray = pub.supplementary?.[category]?.[subCategory] || [];
					if (linkArray.length > 0 && !categoryTypes.has(category)) {
						yearData[year][type] += 1;
						categoryTypes.add(category)
					}
				});
			});

			// Build chart labels (year) and datasets
			const labels = Object.keys(yearData).sort(); // e.g. [ '2018', '2019', ...]

			// Unique type names
			const uniqueTypes = [...new Set(supplementary.map(({ type }) => type))];

			const datasets = uniqueTypes.map((type, index) => {
				const colorIndex = index % this.colours.length;
				return {
					label: type,
					data: labels.map((year) => yearData[Number(year)][type]),
					backgroundColor: this.colours[colorIndex].barColour,
					borderColor: this.colours[colorIndex].borderColour,
					borderWidth: 0,
					maxBarThickness: 100,
				};
			});

			return { labels, datasets };
		} catch (error) {
			throw new Error(`Error fetching supplementary stats: ${error}`);
		}
	}

	async findAllSupplementaryDetails() {

		const uhnAuthors = new Set();

		try {
			const publications = await this.publicationModel.find({
				date: { $gte: '2018-01-01' },
			});

			const scientists = await this.authorModel.find({});

			// Build a set of normalized scientist name variants
			const scientistSet = new Set<string>();
			scientists.forEach((s) => {
				scientistSet.add(`${s.lastName}, ${s.firstName}`);
			});
			

			publications.forEach((pub) => {
				// Object.entries(pub.supplementary).forEach((category, category_obj) => {
				// 	if (category_obj && Object.keys(category_obj).length > 0) {
				// 		console.log(category, Object.keys(category_obj));
				// 	}
				// })
				scientistSet.forEach((scientist) => {
					if ((pub.authors.toLowerCase()).includes(scientist.toLowerCase())) {
						uhnAuthors.add(scientist)
					}
				})
			});
			return Array.from(uhnAuthors);
		} catch (error) {
			throw new Error(`Error fetching supplementary stats: ${error}`);
		}
	}




	async findAuthorAnnualSupplementary(email: string) {

		try {
			const author = await this.authorModel.findOne({ email: new RegExp(`^${email}$`, 'i') }).exec();
			if (!author) {
				throw new Error(`Author with email ${email} not found`);
			}

			// Searching for "LastName, FirstName" in the publication's authors string
			const query = {
				authors: { $regex: new RegExp(`\\b${author.lastName}, ${author.firstName}\\b`, 'i') },
			};

			const publications = await this.statsModel
				.find(query)
				.collation({ locale: 'en', strength: 2 });

			const filteredPublications = publications.filter(
				(pub) => new Date(pub.date) >= new Date('2018-01-01'),
			);

			const yearData: Record<number, Record<string, number>> = {};

			filteredPublications.forEach((pub) => {
				const year = new Date(pub.date).getFullYear();
				// Initialize year row if needed
				if (!yearData[year]) {
				yearData[year] = {};
				supplementary.forEach(({ type }) => {
					yearData[year][type] = 0;
				});
				}

				let categoryTypes = new Set()

				// Tally each subcategory link count
				supplementary.forEach(({ category, subCategory, type }) => {
				const linkArray = pub.supplementary?.[category]?.[subCategory] || [];
				if (linkArray.length > 0 && !categoryTypes.has(category)) {
					yearData[year][type] += 1;
					categoryTypes.add(category)
				}
				});
			});

			const labels = Object.keys(yearData).sort();
			const uniqueTypes = [...new Set(supplementary.map(({ type }) => type))];
			const datasets = uniqueTypes.map((type, index) => {
				const colorIndex = index % this.colours.length;
				return {
					label: type,
					data: labels.map((year) => yearData[Number(year)][type]),
					backgroundColor: this.colours[colorIndex].barColour,
					borderColor: this.colours[colorIndex].borderColour,
					borderWidth: 0,
					maxBarThickness: 100,
				};
			});

		return { labels, datasets };

		} catch (error) {
			throw new Error(`Error fetching author annual supplementary: ${error}`);
		}
	}


	async findPublicationsByAuthor(enid: string | number) {
			try {
				const enidNumber = Number(enid);

				// Fetch all authors and find targetAuthor
				const allAuthors = await this.authorModel.find({}).lean();
				const targetAuthor = allAuthors.find((author) => author.ENID === enidNumber);
				if (!targetAuthor) throw new Error('Author not found');

				// Fetch all publications
				const allPublications = await this.publicationModel.find({}).lean();

				// Group publications by author
				const publicationsByAuthor = allAuthors.reduce((acc, author) => {
					const authorNamePattern = new RegExp(`${author.lastName}, ${author.firstName}`, 'i');
					acc[author.ENID] = allPublications.filter((pub) =>
						pub.authors.match(authorNamePattern),
					);
					return acc;
				}, {} as Record<number, any[]>);

				// Prepare counters
				const totalCategoryContributions: Record<string, number> = {};
				supplementary.forEach(({ type }) => {
					totalCategoryContributions[type] = 0;
				});

				// Build authorStatsMap
				const authorStatsMap: {
					[key: number]: {
						name: string;
						categoryContributions: Record<string, number>;
						totalCitations: number;
					};
				} = {};

				allAuthors.forEach((author) => {
					const pubs = publicationsByAuthor[author.ENID] || [];
					const statsObj = {
						name: `${author.firstName} ${author.lastName}`,
						categoryContributions: {} as Record<string, number>,
						totalCitations: 0,
					};

					// Initialize counters for each type
					supplementary.forEach(({ type }) => {
						statsObj.categoryContributions[type] = 0;
					});

					pubs.forEach((pub) => {
						statsObj.totalCitations += pub.citations || 0;
					
						const countedCategories = new Map();
					
						supplementary.forEach(({ category, type }) => {
							if (!countedCategories.has(type)) countedCategories.set(type, false);
							// Check if at least one subcategory has data and count only once per category
							Object.values(pub.supplementary?.[category] || {}).forEach((linkArray) => {
								if (Array.isArray(linkArray) && linkArray.length > 0 && !countedCategories.get(type)) {
									statsObj.categoryContributions[type] += 1;
									totalCategoryContributions[type] += 1;
									countedCategories.set(type, true);
								}
							});
						});
					});
					

					authorStatsMap[author.ENID] = statsObj;
				});

				// categoryRankings for each type
				const categoryRankings: { [key: string]: any[] } = {};
				supplementary.forEach(({ type }) => {
					const sorted = Object.entries(authorStatsMap)
					.map(([authorEnid, stats]) => ({
						enid: Number(authorEnid),
						name: stats.name,
						contributions: stats.categoryContributions[type],
					}))
					.sort((a, b) => b.contributions - a.contributions);

					// rank
					categoryRankings[type] = sorted.map((entry, idx) => ({
						...entry,
						rank: idx + 1,
					}));
				});

				// Gather stats for target author
				const targetAuthorStats = authorStatsMap[enidNumber];
				if (!targetAuthorStats) {
					throw new Error('Author has no contributions');
				}

				const pubsOfTarget = publicationsByAuthor[enidNumber] || [];
				const totalPubsForAuthor = pubsOfTarget.length || 0;

				const categoryStats = supplementary.reduce((acc, { type }) => {
					const arr = categoryRankings[type];
					const foundIdx = arr.findIndex((item) => item.enid === enidNumber);
					const authorRank = foundIdx === -1 ? arr.length : foundIdx + 1;
					const totalAuthors = arr.length;
					const rankPercentage = Math.ceil((authorRank / totalAuthors) * 100);

					const authorContributions = targetAuthorStats.categoryContributions[type];
					const openSciencePercentage = Math.ceil((authorContributions / totalPubsForAuthor) * 100);

					acc[type] = {
						total: totalCategoryContributions[type],
						authorContributions,
						rank: authorRank,
						percentage: rankPercentage,
						openSciencePercentage,
					};
					return acc;
				}, {} as Record<string, any>);

				// Build scatterData
				const uniqueTypes = Array.from(new Set(supplementary.map((s) => s.type)));

				const scatterData = {
					datasets: uniqueTypes.map((type, index) => {
					const { barColour, borderColour } = this.colours[index % this.colours.length];
				
					// Build the data array for x/y plus separate arrays for color/radius
					const points = categoryRankings[type].map(entry => ({
						x: entry.rank,
						y: entry.contributions,
						label: entry.enid === enidNumber
						? `${entry.name} (${entry.contributions} contributions, ranked ${entry.rank})`
						: `Anonymous (${entry.contributions} contributions, ranked ${entry.rank})`
					}));
				
					const pointBackgroundcolours = categoryRankings[type].map(entry =>
						entry.enid === enidNumber
						? 'rgba(255, 99, 132, 1)'
						: barColour
					);
				
					const pointBordercolours = categoryRankings[type].map(entry =>
						entry.enid === enidNumber
						? 'rgba(255, 99, 132, 1)'
						: borderColour
					);
				
					const pointRadii = categoryRankings[type].map(entry =>
						entry.enid === enidNumber ? 10 : 5
					);
				
					return {
						label: type,
						data: points,
						backgroundColor: barColour,
						borderColour,
						pointBackgroundColor: pointBackgroundcolours,
						pointBorderColor: pointBordercolours,
						pointRadius: pointRadii
					};
					})
				};

				// Return final data
				return {
					author: targetAuthorStats.name,
					authorEmail: targetAuthor.email,
					totalCitations: targetAuthorStats.totalCitations,
					totalPublications: totalPubsForAuthor,
					categoryStats,
					platformRankings: categoryRankings,
					scatterData,
				};
			} catch (error) {
				throw new Error(
					`Error fetching publications for author: ${
						error instanceof Error ? error.message : 'Unknown error'
					}`,
				);
			}
		}
		
	async findPublicationHistogramData(enid: string | number) {
		try {
			const enidNumber = Number(enid);
		
			// Fetch all authors and find targetAuthor
			const allAuthors = await this.authorModel.find({}).lean();
			const targetAuthor = allAuthors.find((author) => author.ENID === enidNumber);
			if (!targetAuthor) throw new Error('Author not found');
		
			// Fetch all publications
			const allPublications = await this.publicationModel.find({}).lean();
		
			// Group publications by author
			const publicationsByAuthor = allAuthors.reduce((acc, author) => {
					const authorNamePattern = new RegExp(`${author.lastName}, ${author.firstName}`, 'i');
					acc[author.ENID] = allPublications.filter((pub) =>
						pub.authors.match(authorNamePattern),
					);
				return acc;
			}, {} as Record<number, any[]>);
		
			// Build authorContributionsMap for each category
			const authorContributionsMap: Record<string, Record<number, number>> = {};
			const uniqueTypes = [...new Set(supplementary.map(({ type }) => type))];
			
			uniqueTypes.forEach(type => {
				authorContributionsMap[type] = {};
			});
		
			// Calculate contributions for each author by type
			allAuthors.forEach(author => {
				const pubs = publicationsByAuthor[author.ENID] || [];
				
				uniqueTypes.forEach(type => {
				let contributionCount = 0;
				
				pubs.forEach((pub) => {
					const countedCategories = new Set();
					
					supplementary.forEach(({ category, subCategory, type: itemType }) => {
						if (itemType === type && !countedCategories.has(category)) {
							const linkArray = pub.supplementary?.[category]?.[subCategory] || [];
							if (Array.isArray(linkArray) && linkArray.length > 0) {
								contributionCount += 1;
								countedCategories.add(category);
							}
						}
					});
				});
				
				authorContributionsMap[type][author.ENID] = contributionCount;
				});
			});
		
			// Build histogram data for each type
			const histogramData: Record<string, any> = {};
			
			uniqueTypes.forEach(type => {
				const authorContributions = Object.values(authorContributionsMap[type]);
				if (authorContributions.length === 0) return;
				
				// Find min and max contributions
				const maxContribution = Math.max(...authorContributions);
				const targetAuthorContribution = authorContributionsMap[type][enidNumber] || 0;
				
				// Create 10 bins or less if maxContribution is small
				const binCount = Math.min(10, maxContribution + 1);
				const binSize = Math.ceil(maxContribution / binCount);
				
				// Initialize bins
				const bins = Array(binCount).fill(0).map((_, i) => {
					const start = i * binSize;
					const end = (i + 1) * binSize - 1;
					return {
						binRange: `${start}-${end}`,
						start,
						end,
						count: 0,
						isUserBin: false
					};
				});
				
				// Count authors in each bin
				authorContributions.forEach(contribution => {
				const binIndex = Math.min(Math.floor(contribution / binSize), binCount - 1);
					bins[binIndex].count += 1;
				});
				
				// Mark the bin where the target author falls
				const userBinIndex = Math.min(Math.floor(targetAuthorContribution / binSize), binCount - 1);
				if (userBinIndex >= 0) {
					bins[userBinIndex].isUserBin = true;
				}
				
				histogramData[type] = {
					bins,
					userContribution: targetAuthorContribution,
					maxContribution
				};
			});
			
			// Format data for Chart.js
			const datasets = uniqueTypes.map((type, index) => {
				const typeData = histogramData[type];
				const colorIndex = index % this.colours.length;
				
				// Create background colours array where user's bin is highlighted pink
				const backgroundcolours = typeData.bins.map(bin => 
					bin.isUserBin ? 'rgba(255, 99, 132, 1)' : this.colours[colorIndex].barColour
				);
				
				// Create border colours array
				const bordercolours = typeData.bins.map(bin => 
					bin.isUserBin ? 'rgba(255, 99, 132, 1)' : this.colours[colorIndex].borderColour
				);
				
				return {
					label: type,
					data: typeData.bins.map(bin => bin.count),
					binLabels: typeData.bins.map(bin => bin.binRange),
					backgroundColor: backgroundcolours,
					borderColor: bordercolours,
					borderWidth: 1
				};
			});
		
			return { datasets };

		} catch (error) {
			throw new Error(
				`Error creating histogram data: ${
				error instanceof Error ? error.message : 'Unknown error'
				}`,
			);
		}
	}
	async getLinkStats(enid: string | number) {

		try {
			const enidNumber = Number(enid);
			const scientist = await this.authorModel.findOne({ENID: enidNumber});
			if (!scientist) throw new Error('Author not found');

			const scientistName = `${scientist.lastName}, ${scientist.firstName}`

			const pubs = await this.publicationModel.find({
				authors: { $regex: scientistName, $options: "i" }
			})
			
			let resourceExportData: AuthorSupplementaryLinks[] = [];

			for (const pub of pubs) {
				const supp = pub.supplementary || {};

				// Loop over top-level resource categories: code, data, containers, etc.
				for (const [resourceType, resources] of Object.entries(supp)) {

					// Loop over specific resource types within that category: github, geo, dbgap, etc.
					for (const [resource, links] of Object.entries(resources)) {
						if (!Array.isArray(links)) continue;

						for (const link of links) {
							resourceExportData.push({
								link,
								resource_type: resourceType,
								resource,
								publication_title: pub.name,
								publication_doi: pub.doi,
								date: pub.date,
								scientist: scientistName,
							});
						}
					}
				}
			}

			return resourceExportData

		} catch (error) {
			
		}

	}
}
