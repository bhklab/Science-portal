export default interface BlankPub {
    _id?: {
        $oid: string;
    };
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
    supplementary: {
        code?: Record<string, string[]>;
        data?: Record<string, string[]>;
        containers?: Record<string, string[]>;
        results?: Record<string, string[]>;
        trials?: Record<string, string[]>;
        packages?: Record<string, string[]>;
        miscellaneous?: Record<string, string[]>;
    };
}
