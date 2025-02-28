// publication.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StatsDocument } from '../interfaces/stats.interface';
import { AuthorDocument } from '../interfaces/author.interface';
import { PublicationDocument } from '../interfaces/publication.interface';

// This new 'supplementary' array is an example. Adjust to your real definitions.
import { supplementary } from '../interfaces/link-types';

@Injectable()
export class StatsService {
  constructor(
    @InjectModel('Stats') private statsModel: Model<StatsDocument>,
    @InjectModel('Author') private authorModel: Model<AuthorDocument>,
    @InjectModel('Publication') private publicationModel: Model<PublicationDocument>,
  ) {}

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
    const colors = [
      { barColour: 'rgba(127, 97, 219, 1)', borderColour: 'rgba(127, 97, 219, 1)' },
      { barColour: 'rgba(89, 113, 203, 1)', borderColour: 'rgba(89, 113, 203, 1)' },
      { barColour: 'rgba(89, 170, 106, 1)', borderColour: 'rgba(89, 170, 106, 1)' },
      { barColour: 'rgba(242, 172, 60, 1)', borderColour: 'rgba(242, 172, 60, 1)' },
      { barColour: 'rgba(203, 93, 56, 1)', borderColour: 'rgba(203, 93, 56, 1)' },
      { barColour: 'rgba(68, 152, 145, 1)', borderColour: 'rgba(68, 152, 145, 1)' },
    ];

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
        const colorIndex = index % colors.length;
        return {
          label: type,
          data: labels.map((year) => yearData[Number(year)][type]),
          backgroundColor: colors[colorIndex].barColour,
          borderColor: colors[colorIndex].borderColour,
          borderWidth: 0,
          maxBarThickness: 100,
        };
      });

      return { labels, datasets };
    } catch (error) {
      throw new Error(`Error fetching supplementary stats: ${error}`);
    }
  }


  async findAuthorAnnualSupplementary(email: string) {
    const colors = [
      { barColour: 'rgba(127, 97, 219, 1)', borderColour: 'rgba(127, 97, 219, 1)' },
      { barColour: 'rgba(89, 113, 203, 1)', borderColour: 'rgba(89, 113, 203, 1)' },
      { barColour: 'rgba(89, 170, 106, 1)', borderColour: 'rgba(89, 170, 106, 1)' },
      { barColour: 'rgba(242, 172, 60, 1)', borderColour: 'rgba(242, 172, 60, 1)' },
      { barColour: 'rgba(203, 93, 56, 1)', borderColour: 'rgba(203, 93, 56, 1)' },
      { barColour: 'rgba(68, 152, 145, 1)', borderColour: 'rgba(68, 152, 145, 1)' },
    ];

    try {
      const author = await this.authorModel.findOne({ email }).exec();
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
        const colorIndex = index % colors.length;
        return {
          label: type,
          data: labels.map((year) => yearData[Number(year)][type]),
          backgroundColor: colors[colorIndex].barColour,
          borderColor: colors[colorIndex].borderColour,
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

      const colors = [
        { fillColor: 'rgba(127, 97, 219, 1)', borderColor: 'rgba(127, 97, 219, 1)' },
        { fillColor: 'rgba(89, 113, 203, 1)', borderColor: 'rgba(89, 113, 203, 1)' },
        { fillColor: 'rgba(89, 170, 106, 1)', borderColor: 'rgba(89, 170, 106, 1)' },
        { fillColor: 'rgba(242, 172, 60, 1)', borderColor: 'rgba(242, 172, 60, 1)' },
        { fillColor: 'rgba(203, 93, 56, 1)', borderColor: 'rgba(203, 93, 56, 1)' },
        { fillColor: 'rgba(68, 152, 145, 1)', borderColor: 'rgba(68, 152, 145, 1)' },
      ];

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
      const totalPubsForAuthor = pubsOfTarget.length || 1;

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
		  const { fillColor, borderColor } = colors[index % colors.length];
	  
		  // Build the data array for x/y plus separate arrays for color/radius
		  const points = categoryRankings[type].map(entry => ({
			x: entry.rank,
			y: entry.contributions,
			label: entry.enid === enidNumber
			  ? `${entry.name}, (You, ${entry.rank} overall)`
			  : `Anonymous scientist (${entry.rank} overall)`
		  }));
	  
		  const pointBackgroundColors = categoryRankings[type].map(entry =>
			entry.enid === enidNumber
			  ? 'rgba(255, 99, 132, 1)'
			  : fillColor
		  );
	  
		  const pointBorderColors = categoryRankings[type].map(entry =>
			entry.enid === enidNumber
			  ? 'rgba(255, 99, 132, 1)'
			  : borderColor
		  );
	  
		  const pointRadii = categoryRankings[type].map(entry =>
			entry.enid === enidNumber ? 10 : 5
		  );
	  
		  return {
			label: type,
			data: points,
			backgroundColor: fillColor,
			borderColor,
			pointBackgroundColor: pointBackgroundColors,
			pointBorderColor: pointBorderColors,
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
}
