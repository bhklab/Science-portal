export default interface Pub {
    _id: {
        $oid: string;
    };
    PMID: number;
    doi: string;
    date: string;
    name: string;
    journal: string;
    type: string;
    authors: string;
    filteredAuthors?: string;
    affiliations: string;
    citations: number;
    dateAdded?: string;
    publisher?: string;
    status: string;
    image: string;
    supplementary: {
        github?: string;
        codeOcean?: string;
        geo?: string;
        dbGap?: string;
        figshare?: string;
        kaggle?: string;
        dryad?: string;
        empiar?: string;
        gigaDb?: string;
        dataverse?: string;
        IEEE?: string;
        mendeley?: string;
        openScienceframework?: string;
        zenodo?: string;
        gitlab?: string;
        finngenGitbook?: string;
        pdf?: string;
        docx?: string;
        clinicalTrial?: string;
        ega?: string;
        zip?: string;
        xlsx?: string;
        csv?: string;
        gtexPortal?: string;
        proteinDataBank?: string;
        ebiAcUk?: string;
        gsea?: string;
    };
}
