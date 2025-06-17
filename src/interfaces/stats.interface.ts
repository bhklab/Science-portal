import { Document } from 'mongoose';

export interface StatsDocument extends Document {
	name: string;
	authors: string;
	date: Date;
	citations: number;
		supplementary: {
			code?: Record<string, string[]>;
			data?: Record<string, string[]>;
			containers?: Record<string, string[]>;
			results?: Record<string, string[]>;
			trials?: Record<string, string[]>;
			protocols?: Record<string, string[]>;
			packages?: Record<string, string[]>;
			miscellaneous?: Record<string, string[]>;
		};
}

