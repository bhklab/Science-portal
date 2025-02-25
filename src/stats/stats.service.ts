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

      // yearData = { 2018: { 'Github': count, 'Gitlab': count, ... }, 2019: {...}, ... }
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

        // For each possible (category, subCategory, type)
        supplementary.forEach(({ category, subCategory, type }) => {
          const linkArray = pub.supplementary?.[category]?.[subCategory] || [];
          if (linkArray.length > 0) {
            yearData[year][type] += linkArray.length;
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

        // Tally each subcategory link count
        supplementary.forEach(({ category, subCategory, type }) => {
          const linkArray = pub.supplementary?.[category]?.[subCategory] || [];
          if (linkArray.length > 0) {
            yearData[year][type] += linkArray.length;
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

      // Fetch all authors
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

      // This tracks overall usage counts across *all authors* (for ranking, etc.)
      const totalCategoryContributions: Record<string, number> = {};

      // Initialize totalCategoryContributions to zero for each type
      supplementary.forEach(({ type }) => {
        if (!totalCategoryContributions[type]) {
          totalCategoryContributions[type] = 0;
        }
      });

      // We'll store each author's stats here
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
          categoryContributions: {} as Record<string, number>,
          totalCitations: 0,
        };

        // Initialize counters for each 'type'
        supplementary.forEach(({ type }) => {
          authorStats.categoryContributions[type] = 0;
        });

        publications.forEach((pub) => {
          authorStats.totalCitations += pub.citations || 0;

          // Process nested arrays for supplementary
          supplementary.forEach(({ category, subCategory, type }) => {
            const linkArray = pub.supplementary?.[category]?.[subCategory] || [];
            // If there's at least one link
            if (linkArray.length > 0) {
              // We add +1 to the *author* for that 'type' (or linkArray.length if you want to count them all)
              authorStats.categoryContributions[type] += 1;
              // Track total usage across all authors
              totalCategoryContributions[type] += 1;
            }
          });
        });

        authorStatsMap[author.ENID] = authorStats;
      });

      // Calculate rankings for each type
      const categoryRankings: { [key: string]: any[] } = {};

      supplementary.forEach(({ type }) => {
        // Build a sorted list of authors for that type
        const sortedAuthors = Object.entries(authorStatsMap)
          .map(([enid, stats]) => ({
            enid: Number(enid),
            name: stats.name,
            totalCitations: stats.totalCitations,
            contributions: stats.categoryContributions[type],
          }))
          .sort((a, b) => b.contributions - a.contributions);

        // Add a rank (1-based)
        categoryRankings[type] = sortedAuthors.map((author, index) => ({
          ...author,
          rank: index + 1,
        }));
      });

      // Format for scatter plot / external use
      const platformRankings = supplementary.reduce((acc, { type }) => {
        acc[type] = categoryRankings[type].map((entry) => ({
          enid: entry.enid,
          name: entry.enid === enidNumber ? entry.name : 'Anonymous',
          contributions: entry.contributions,
          rank: entry.rank,
        }));
        return acc;
      }, {} as Record<string, any[]>);

      // Gather the target author's stats
      const targetAuthorStats = authorStatsMap[enidNumber];
      if (!targetAuthorStats) throw new Error('Author has no contributions');

      // Build final categoryStats
      const categoryStats = supplementary.reduce((acc, { type }) => {
        // find the rank for the target author
        const arr = categoryRankings[type];
        const authorIndex = arr.findIndex((item) => item.enid === enidNumber);
        const authorRank = authorIndex === -1 ? arr.length : authorIndex + 1;
        const totalAuthors = arr.length;
        const rankPercentage = Math.ceil((authorRank / totalAuthors) * 100);

        const totalAuthorPubs = publicationsByAuthor[enidNumber]?.length || 1;
        const authorContribCount = targetAuthorStats.categoryContributions[type];

        // This is how often the author used that type across all their pubs
        // e.g. if they had 3 pubs, but used the resource in 2 of them -> 66%
        const openSciencePercentage = Math.ceil(
          (authorContribCount / totalAuthorPubs) * 100,
        );

        acc[type] = {
          total: totalCategoryContributions[type],
          authorContributions: authorContribCount,
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
        `Error fetching publications for author: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      );
    }
  }
}
