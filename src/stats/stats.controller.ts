import { Controller, Get, Body, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller('stats')
export class StatsController {
    constructor(private StatsService: StatsService) {}
	@Get('lab')
    async getAllAuthors() {
        try {
            const authors = await this.StatsService.findAllAuthors();
            return authors;
        } catch (error) {
            throw new HttpException(`Error retrieving publication: ${error}`, HttpStatus.NOT_FOUND);
        }
    }
}
