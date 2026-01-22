import { Controller, Get, Body, HttpException, HttpStatus, Param, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { PublicationService } from './publication.service';
import { LoggingService } from '../logging/logs.service';
import { PublicationDocument } from 'src/interfaces/publication.interface';
import { PublicationChangesDocument } from '../interfaces/publication-changes.interface';
import { PublicationDocumentNew } from 'src/interfaces/publication-new.interface';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('publications')
export class PublicationController {
    constructor(
		private publicationService: PublicationService,
		private loggingService: LoggingService
	) {}

    @Post('select')
    async getSelectPublications(
		@Body('total') total: number, 
		@Body('sort') sort: string,
		@Body('lab') lab: string,
		@Body('resources') resources: string[],
		@Body('search') search: string,
		@Body('email') email: string
	){
		if (sort || lab || search || (resources.length > 0)){
			try {
				await this.loggingService.logAction(
					`Search/Filter`, 
					email ? email : 'Not signed in',
					{
						search,
						lab: lab ? lab : '',
						sort: sort ? sort : '',
						resources
					}
				);
			} catch (error) {
				console.log(error)
			}
		}

        try {
            const publications = await this.publicationService.findSelectPublications(total, sort, lab, resources, search);
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

	@Post('scrape')
	async scrapePublicationData(@Body() newPub: PublicationDocumentNew) {
		try {
			const createdPublication = await this.publicationService.fetchPublication(newPub);
			console.log(createdPublication)
			return createdPublication
		} catch (error) {
			throw new HttpException(`Error creating publication: ${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}


	@Post('new')
	async createPublication(@Body() newPub: PublicationDocumentNew) {
		try {
			const createdPublication = await this.publicationService.createPublication(newPub);
			console.log(createdPublication)
			return createdPublication
		} catch (error) {
			throw new HttpException(`Error creating publication: ${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
		
	}

	@Post('new/pdf')
	@UseInterceptors(FileInterceptor('file'))
	async uploadPublicationPDF(@UploadedFile() pdf: Express.Multer.File) {
		return await this.publicationService.uploadPublicationPDF(pdf);		
	}
}
