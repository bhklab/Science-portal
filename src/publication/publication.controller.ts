import { Controller, Get, HttpException, HttpStatus, Param } from '@nestjs/common';
import { PublicationService } from './publication.service';

@Controller('publications')
export class PublicationController {
    constructor(private publicationService: PublicationService) {}

    @Get('all')
    async getAllPublications() {
        try {
            const publications = await this.publicationService.findAll();
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
