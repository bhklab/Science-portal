import { Controller, Body, HttpException, HttpStatus, Post } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackDocument } from '../interfaces/feedback.interface'


@Controller('feedback')
export class FeedbackController {
    constructor(private FeedbackService: FeedbackService) {}

    @Post('submit')
    async submitFeedback(@Body() feedback: FeedbackDocument) {
        try {
            const emails = await this.FeedbackService.submitFeedback(feedback);
            return emails;
        } catch (error) {
            throw new HttpException(`Error retrieving emails: ${error}`, HttpStatus.NOT_FOUND);
        }
    }
}
