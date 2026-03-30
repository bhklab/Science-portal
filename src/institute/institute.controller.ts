import { Controller, Get, Body, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { InstituteService } from './institute.service';

@Controller('institute')
export class InstituteController {
    constructor(private InstituteService: InstituteService) {}
    @Get('get')
    async getInstitute() {
        try {
            const institute = await this.InstituteService.getInstitute();
            return institute;
        } catch (error) {
            throw new HttpException(`Error retrieving emails: ${error}`, HttpStatus.NOT_FOUND);
        }
    }
}
