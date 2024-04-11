import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { PublicationService } from './publication.service';

@Controller('publications')
export class PublicationController {
    constructor(private publicationService: PublicationService) {}

    @Get('all')
    async getAllPublications() {
        try {
            const publications = await this.publicationService.findAll();
            return publications; // NestJS will automatically send this as a JSON response
        } catch (error) {
            throw new HttpException(`Error retrieving publications: ${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
