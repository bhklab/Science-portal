import { Controller, Get, Body, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDocument } from 'src/interfaces/user.interface';

@Controller('user')
export class UserController {
    constructor(private EmailService: UserService) {}
    @Get('emails/admin')
    async getAdminEmails() {
        try {
            const emails = await this.EmailService.getAdminEmails();
            return emails;
        } catch (error) {
            throw new HttpException(`Error retrieving emails: ${error}`, HttpStatus.NOT_FOUND);
        }
    }
}
