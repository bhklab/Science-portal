import { Controller, Get, Body, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { EmailService } from './email.service';

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
}
