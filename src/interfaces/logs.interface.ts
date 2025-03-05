export interface LogStats {
    type: string;
    email: string;
	timestamp: Date;
	searchCriteria?: {
		search?: string,
		lab?: string,
		sort?: string,
		resources?: string[]
	};
}
