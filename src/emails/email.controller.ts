import { Controller, Get, Body, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import { PublicationDocument } from 'src/interfaces/publication.interface';

@Controller('emails')
export class EmailController {
    constructor(private EmailService: EmailService) {}

    @Get('all')
    async getAllEmails() {
        try {
            const emails = await this.EmailService.findAllEmails();
            return emails;
        } catch (error) {
            throw new HttpException(`Error retrieving emails: ${error}`, HttpStatus.NOT_FOUND);
        }
    }

	@Get('fanout')
    async getFanoutEmail() {
        try {
            const emails = await this.EmailService.getFanout();
            return emails;
        } catch (error) {
            throw new HttpException(`Error retrieving emails: ${error}`, HttpStatus.NOT_FOUND);
        }
    }

	@Post('fanout/send')
    async sendFanoutEmail(@Body('pub') pub: PublicationDocument, @Body('verdict') verdict: boolean) {
        try {
            const emails = await this.EmailService.sendFanout(pub, verdict);
            return emails;
        } catch (error) {
            throw new HttpException(`Error retrieving emails: ${error}`, HttpStatus.NOT_FOUND);
        }
    }
}
