export interface NewPub {
    doi: string;
    name: string;
    journal: string;
    type: string;
    authors: string;
    filteredAuthors: string;
    affiliations: string;
    citations: number;
    status: string;
    publisher: string;
    date: any;
    scraped: boolean;
    fanout: {
        request: boolean;
        completed: boolean;
    };
    supplementary: {
        code?: Record<string, string[]>;
        data?: Record<string, string[]>;
        containers?: Record<string, string[]>;
        results?: Record<string, string[]>;
        trials?: Record<string, string[]>;
        packages?: Record<string, string[]>;
        miscellaneous?: Record<string, string[]>;
    };
    otherLinks: {
        name: string;
        description: string;
        recommendedCategory: string;
        link: string;
    }[];
    submitter: string;
}

export function createDefaultNewPub(): NewPub {
    return {
        doi: '',
        name: '',
        journal: '',
        type: '',
        authors: '',
        filteredAuthors: '',
        affiliations: '',
        citations: 0,
        status: 'Published',
        publisher: '',
        date: new Date(),
        scraped: false,
        fanout: {
            request: false,
            completed: false
        },
        supplementary: {
            code: {},
            data: {},
            containers: {},
            results: {},
            trials: {},
            packages: {},
            miscellaneous: {}
        },
        otherLinks: [],
        submitter: ''
    };
}
