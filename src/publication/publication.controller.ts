import { Controller, Get, Body, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { PublicationService } from './publication.service';

@Controller('publications')
export class PublicationController {
    constructor(private publicationService: PublicationService) {}

    @Post('all')
    async getAllPublications(
		@Body('total') total: number, 
		@Body('sort') sort: string,
		@Body('lab') lab: string,
		@Body('name') name: string
	){
        try {
            const publications = await this.publicationService.findPublications(total, sort, lab, name);
            return publications;
        } catch (error) {
            throw new HttpException(`Error retrieving publications: ${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

	@Get(':doi')
    async getPublicationByDoi(@Param('doi') doi: string) {
        try {
			const decodedDoi = decodeURIComponent(doi);
            const publication = await this.publicationService.findByDoi(decodedDoi);
            return publication;
        } catch (error) {
            throw new HttpException(`Error retrieving publication: ${error}`, HttpStatus.NOT_FOUND);
        }
    }
}
