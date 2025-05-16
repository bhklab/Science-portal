export interface AuthorStats {
    _id: any;
    name: string;
    totalValidLinks: number;
    citations: number;
    categoryContributions: {
        code: number;
        data: number;
        containers: number;
        results: number;
        trials: number;
		protocols: number;
		packages: number;
        miscellaneous: number;
    };
}
