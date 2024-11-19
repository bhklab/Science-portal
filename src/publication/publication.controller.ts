import { Controller, Get, Body, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { PublicationService } from './publication.service';
import { PublicationDocument } from 'src/interfaces/publication.interface';
import { PublicationChangesDocument } from '../interfaces/publication-changes.interface';

@Controller('publications')
export class PublicationController {
    constructor(private publicationService: PublicationService) {}

    @Post('select')
    async getSelectPublications(
		@Body('total') total: number, 
		@Body('sort') sort: string,
		@Body('lab') lab: string,
		@Body('name') name: string
	){
        try {
            const publications = await this.publicationService.findSelectPublications(total, sort, lab, name);
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

	@Post('changes')
	async savePublicationChanges(@Body() pub: PublicationChangesDocument) {
	  try {
		return await this.publicationService.savePublicationChanges(pub);
	  } catch (error) {
		console.error('Error saving publication changes:', error);
		throw new HttpException(`Error saving publication: ${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
	  }
	}


	@Post('new')
	async createPublication(@Body() newPub: PublicationDocument) {
		console.log(newPub);
	  try {
		const createdPublication = await this.publicationService.createPublication(newPub);
		return createdPublication;
	  } catch (error) {
		throw new HttpException(`Error creating publication: ${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
	  }
	}
}
