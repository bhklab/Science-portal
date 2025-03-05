import { Controller, Get, Body, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { AuthorService } from './author.service';
import { LoggingService } from '../logging/logs.service';


@Controller('authors')
export class AuthorController {
    constructor(
		private AuthorService: AuthorService,
		private loggingService: LoggingService
	) {}
	@Get('all')
    async getAllAuthors() {
        try {
            const authors = await this.AuthorService.findAllAuthors();
            return authors;
        } catch (error) {
            throw new HttpException(`Error retrieving authors: ${error}`, HttpStatus.NOT_FOUND);
        }
    }
	@Post('one')
    async getOneAuthor(@Body('email') email: string) {
		try {
			await this.loggingService.logAction(
				`Profile Page Check`, 
				email ? email : 'Not signed in',
				{}
			);
		} catch (error) {
			console.log(error)
		}
		
        try {
            const authors = await this.AuthorService.findOneAuthor(email);
            return authors;
        } catch (error) {
            throw new HttpException(`Error retrieving authors: ${error}`, HttpStatus.NOT_FOUND);
        }
    }
}
