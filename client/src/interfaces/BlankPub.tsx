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
        code?: {
            github?: string[];
            gitlab?: string[];
        };
        data?: {
            geo?: string[];
            dbGap?: string[];
            kaggle?: string[];
            dryad?: string[];
            empiar?: string[];
            gigaDb?: string[];
            zenodo?: string[];
            ega?: string[];
            xlsx?: string[];
            csv?: string[];
            proteinDataBank?: string[];
            R?: string[];
        };
        containers?: {
            codeOcean?: string[];
            colab?: string[];
        };
        results?: {
            gsea?: string[];
            figshare?: string[];
        };
        trials?: {
            clinicalTrial?: string[];
        };
        packages?: {
            bioconductor?: string[];
            pypi?: string[];
            CRAN?: string[];
        };
        miscellaneous?: {
            IEEE?: string[];
            pdf?: string[];
            docx?: string[];
            zip?: string[];
        };
    };
}
