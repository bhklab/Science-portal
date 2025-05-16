import { Controller, Get, Body, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { MailingService } from './mailing.service';
import { LoggingService } from '../logging/logs.service';


@Controller('mailing')
export class MailingController {
    constructor(
		private MailingService: MailingService,
		private loggingService: LoggingService
	) {}
	@Post('status')
    async mailStatus(@Body('email') email: string) {
        try {
            const mailStatus = await this.MailingService.mailStatus(email);
            return mailStatus;
        } catch (error) {
            throw new HttpException(`Error retrieving authors: ${error}`, HttpStatus.NOT_FOUND);
        }
    }
	
	@Post('opting')
    async mailingOptIn(@Body('email') email: string, @Body('mailOptIn') mailOptIn: boolean) {
		try {
			console.log(!mailOptIn)
			await this.loggingService.logAction(
				`User has opted ${mailOptIn ? 'out of' : 'in' } mailing`, 
				email ? email : 'Not signed in',
				{}
			);
		} catch (error) {
			console.log(error)
		}
		
        try {
    		return await this.MailingService.updateMailOptIn(email, mailOptIn);
		} catch (error) {
            throw new HttpException(`Error retrieving authors: ${error}`, HttpStatus.NOT_FOUND);
        }
    }
}
