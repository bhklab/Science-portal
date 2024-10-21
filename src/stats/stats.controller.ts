import { Controller, Get, Body, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller('stats')
export class StatsController {
    constructor(private StatsService: StatsService) {}
	@Post('lab')
    async getLabStats(@Body('lab') lab: string) {
        try {
            const publications = await this.StatsService.findLabStats(lab);
            return publications;
        } catch (error) {
            throw new HttpException(`Error retrieving publication: ${error}`, HttpStatus.NOT_FOUND);
        }
    }

	@Get('supplementary')
    async getAllPublications()
	{
        try {
            const publications = await this.StatsService.findAllSupplementary();
            return publications;
        } catch (error) {
            throw new HttpException(`Error retrieving publications: ${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

	@Get('author/:enid')
    async getAuthorStats(@Param('enid') enid: number) {
        try {
            const authorStats = await this.StatsService.findPublicationsByAuthor(enid);
            return authorStats;
        } catch (error) {
            throw new HttpException(`Error retrieving PI stats: ${error}`, HttpStatus.NOT_FOUND);
        }
    }
}
