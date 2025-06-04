import { Controller, Get, Body, HttpException, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { StatsService } from './stats.service';
import { LoggingService } from '../logging/logs.service';

@Controller('stats')
export class StatsController {
    constructor(
		private statsService: StatsService,
		private loggingService: LoggingService
	) {}
	
	// For explore page stats, this returns an authors total citations and publication strictly
	@Post('lab')
    async getLabStats(@Body('lab') lab: string) {
        try {
            const publications = await this.statsService.findLabStats(lab);
            return publications;
        } catch (error) {
            throw new HttpException(`Error retrieving publication: ${error}`, HttpStatus.NOT_FOUND);
        }
    }

	// Data extraction for Analytics page
	@Post('supplementary')
    async getAllSupplementary(@Body('email') email: string){

		try {
			await this.loggingService.logAction(
				`Analytics Page Check`, 
				email ? email : 'Not signed in',
				{}
			);
		} catch (error) {
			console.log(error)
		}

        try {
            const publications = await this.statsService.findAllSupplementary();
            return publications;
        } catch (error) {
            throw new HttpException(`Error retrieving publications: ${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

	@Put('supplementary/author')
    async getAuthorAnnualSupplementary(@Body('email') email: string)
	{
        try {
            const publications = await this.statsService.findAuthorAnnualSupplementary(email);
            return publications;
        } catch (error) {
            throw new HttpException(`Error retrieving publications: ${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

	// Using an authors employee Id find stats for the profile page, this includes ranking
	@Get('author/:enid')
    async getAuthorStats(@Param('enid') enid: string) {
        try {
            const authorStats = await this.statsService.findPublicationsByAuthor(enid);
            return authorStats;
        } catch (error) {
            throw new HttpException(`Error retrieving PI stats: ${error}`, HttpStatus.NOT_FOUND);
        }
    }

	// Using an authors employee Id find stats histogram on profile page
	@Get('author/:enid/histogram')
		async getAuthorHistogram(@Param('enid') enid: string) {
		try {
			return await this.statsService.findPublicationHistogramData(enid);
		} catch (error) {
			throw new HttpException( `Failed to get author histogram data: ${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
