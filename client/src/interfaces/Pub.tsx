export default interface Pub {
    _id?: {
        $oid: string;
    };
    PMID: number;
    doi: string;
    date: string;
    name: string;
    journal: string;
    type: string;
    authors: string;
    filteredAuthors: string;
    affiliations: string;
    citations: number;
    dateAdded: string;
    publisher: string;
    status: string;
    image: string;
    scraped?: boolean;
    fanout?: {
        request: boolean;
        completed: boolean;
    };
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
    otherLinks: {
        name: string;
        recommendedCategory: string;
        description: string;
        link: string;
    }[];
}
