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
            dataverse: string[];
            openScienceFramework: string[];
            finngenGitbook: string[];
            gtexPortal: string[];
            ebiAcUk: string[];
            mendeley: string[];
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
        supplementary: {
            code: {
                github: [],
                gitlab: []
            },
            data: {
                geo: [],
                dbGap: [],
                kaggle: [],
                dryad: [],
                empiar: [],
                gigaDb: [],
                zenodo: [],
                ega: [],
                xlsx: [],
                csv: [],
                proteinDataBank: [],
                dataverse: [],
                openScienceFramework: [],
                finngenGitbook: [],
                gtexPortal: [],
                ebiAcUk: [],
                mendeley: [],
                R: []
            },
            containers: {
                codeOcean: [],
                colab: []
            },
            results: {
                gsea: [],
                figshare: []
            },
            trials: {
                clinicalTrial: []
            },
            packages: {
                bioconductor: [],
                pypi: [],
                CRAN: []
            },
            miscellaneous: {
                IEEE: [],
                pdf: [],
                docx: [],
                zip: []
            }
        },
        otherLinks: [],
        submitter: ''
    };
}
