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
    supplementary: {
        [key: string]: string;
    };
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
        supplementary: {
            github: '',
            codeOcean: '',
            geo: '',
            dbGap: '',
            figshare: '',
            kaggle: '',
            dryad: '',
            empiar: '',
            gigaDb: '',
            dataverse: '',
            IEEE: '',
            mendeley: '',
            openScienceframework: '',
            zenodo: '',
            gitlab: '',
            finngenGitbook: '',
            pdf: '',
            docx: '',
            clinicalTrial: '',
            ega: '',
            zip: '',
            xlsx: '',
            csv: '',
            gtexPortal: '',
            proteinDataBank: '',
            ebiAcUk: '',
            gsea: ''
        }
    };
}
