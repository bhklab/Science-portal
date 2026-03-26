import * as dotenv from 'dotenv'; dotenv.config();
import { Injectable } from '@nestjs/common';

@Injectable()
export class InstituteService {	
	async getInstitute() {
        try {
            const institute = process.env.INSTITUTE || "Princess Margaret Cancer Center"
			return institute
        } catch (error) {
            throw new Error(`Error fetching users`);
        }
    }
}
