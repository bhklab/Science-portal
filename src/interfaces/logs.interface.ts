export interface LogStats {
    type: string;
    email: string;
	timestamp: Date;
	doi?: string
	searchCriteria?: {
		search?: string,
		lab?: string,
		sort?: string,
		resources?: string[]
	};
}
