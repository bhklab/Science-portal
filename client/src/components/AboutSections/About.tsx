import React, { useEffect } from 'react';
import { Image } from 'primereact/image';

type SectionProps = { scrollTarget?: string | null };

export const Overview: React.FC<SectionProps> = ({ scrollTarget }) => {
    useEffect(() => {
        if (!scrollTarget) return;
        const el = document.getElementById(scrollTarget);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, [scrollTarget]);
    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <h2 className="text-heading4Xl xs:text-headingXl font-semibold">Overview</h2>
                <p className="text-bodyLg font-light xs:text-bodyMd">
                    Despite "<span className="font-normal">open science</span>" being essential for scientific progress,
                    research outputs often remain difficult to find, limiting collaboration opportunities and impact.
                    Making research contributions <span className="font-normal">openly</span> accessible requires
                    significant time, resources, and expertise. Once made available, it can still be challenging to
                    track and reward these efforts effectively.
                </p>
                <p className="text-bodyLg font-light xs:text-bodyMd">
                    The Science Portal serves as a platform to centralize and simplify access to research outputs at
                    Princess Margaret. The Science Portal tackles common
                    <span className="font-normal"> transparency </span> and
                    <span className="font-normal"> reproducibility </span>issues faced in research by sharing diverse
                    open science contributions and utilizing robust tools to track them.
                </p>
            </div>
            <div className="flex flex-col gap-1 px-1 overflow-hidden">
                <iframe
                    height="600"
                    src="https://www.youtube.com/embed/L6UxPbZcgmY"
                    title="Science Portal Demo"
                    allowFullScreen
                    className="border-1"
                />
                <p className="text-bodySm text-gray-900">
                    0:00 - Intro | 1:11 - Search Functionality | 2:09 - Publication Overview | 2:57 - Public Statistics
                    | 3:37 - Profile Page and Personal Statistics | 7:06 - Submit a publication | 7:56 - Edit a
                    publication
                </p>
            </div>
        </div>
    );
};

export const Functionality: React.FC<SectionProps> = ({ scrollTarget }) => {
    useEffect(() => {
        if (!scrollTarget) return;
        const el = document.getElementById(scrollTarget);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, [scrollTarget]);
    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-heading3Xl xs:text-headingXl font-semibold text-gray-800">Functionalities</h2>
            <div className="flex flex-col gap-2">
                <h3 className="text-headingLg xs:text-headingMd font-semibold text-black-900 scroll-mt-20 " id="search">
                    Search
                </h3>
                <div className="flex flex-col gap-4">
                    <p className="text-bodyLg font-light xs:text-bodyMd">
                        The Science Portal provides two main search methods for indexing publications in the platform.
                        The first is through the top search bar where you can index publications through keywords (Ex.
                        RNA-seq, Chromatin), a scientist name, a journal, publication title, or doi.
                    </p>
                    <p className="text-bodyLg font-light xs:text-bodyMd">
                        Several search inputs can also be strung together for a more dialed and concise result (Ex.
                        RNA-seq Mesothelioma). Also, if a specific keyword is needed to be guaranteed in the result, it
                        can be placed within parentheses (Ex. mAb806 "Mesothelioma").
                    </p>
                    <div className="flex flex-col items-center gap-4">
                        <Image
                            src="/images/screenshots/search-bar-highlight.png"
                            alt="search-bar-highlight"
                            className="border-1 rounded-lg overflow-hidden shadow-sm w-4/5"
                            preview
                            indicatorIcon={<></>}
                        />
                    </div>
                    <p className="text-bodyLg font-light xs:text-bodyMd">
                        The second search can be executed by clicking the filter button directly to the left of the
                        search bar. This will open up a menu which allows you to filter publications by a specific
                        author at the institution and/or filter publications that share select resources.
                    </p>
                    <div className="flex flex-col items-center gap-4">
                        <Image
                            src="/images/screenshots/filter-menu-button.png"
                            alt="search-bar-highlight"
                            className="border-1 rounded-lg overflow-hidden shadow-sm w-4/5"
                            preview
                            indicatorIcon={<></>}
                        />
                        <Image
                            src="/images/screenshots/filter-menu.png"
                            alt="search-bar-highlight"
                            className="border-1 rounded-lg overflow-hidden shadow-sm w-4/5"
                            preview
                            indicatorIcon={<></>}
                        />
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <h3
                    className="text-headingLg xs:text-headingMd font-semibold text-black-900 scroll-mt-20 "
                    id="institution-statistics"
                >
                    Institution Statistics
                </h3>
                <div className="flex flex-col gap-4">
                    <p className="text-bodyLg font-light xs:text-bodyMd">
                        The platform also provides statistics and visualization to easily quantify various metrics about
                        the institution. The main visualizations included are bar and scatter plots. These help users
                        quickly and efficiently understand overall trends and get an idea of the type of data that can
                        be found in the platform.
                    </p>
                    <div className="flex flex-col items-center gap-4">
                        <Image
                            src="/images/screenshots/statistics-bar-chart.png"
                            alt="search-bar-highlight"
                            className="border-1 rounded-lg overflow-hidden shadow-sm w-4/5"
                            preview
                            indicatorIcon={<></>}
                        />
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <h3
                    className="text-headingLg xs:text-headingMd font-semibold text-black-900 scroll-mt-20 "
                    id="scientist-statistics"
                >
                    Scientist Statistics
                </h3>
                <div className="flex flex-col gap-4">
                    <p className="text-bodyLg font-light xs:text-bodyMd">
                        The Science Portal not only offers statistics for the institution but also for individual
                        scientists. These statistics help scientists gauge their resource contributions, transparency,
                        reproducibility, adherence to{' '}
                        <a
                            target="_blank"
                            href="www.go-fair.org/fair-principles/"
                            className="text-blue-700 font-normal transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
                        >
                            FAIR{' '}
                        </a>{' '}
                        principles, and impact <span className="font-normal">(coming soon)</span>. Scientists are
                        limited to only view their own statistics within the profile page. However, the profile page
                        allows them to anonymously see how their staistics size up against others in the institution.
                        Faculty can access their profile page by logging into the platform using their institution
                        credentials, then navigating to their profile page.
                    </p>
                    <div className="flex flex-col items-center gap-4">
                        <Image
                            src="/images/screenshots/profile-dropdown.png"
                            alt="search-bar-highlight"
                            className="border-1 rounded-lg overflow-hidden shadow-sm w-4/5"
                            preview
                            indicatorIcon={<></>}
                        />
                    </div>
                    <p className="text-bodyLg font-light xs:text-bodyMd">
                        On the profile page, a scientist will be privied with statistics and visualizations that detail
                        how frequently they share resources and the type of resources they share most often within their
                        publications. This includes cards detailing sharing frequency for all resource types and two
                        charts that help quantify total and annual resources shared in publications. The profile page
                        also offers a scientist ways to easily export any of the graphics and download the list of
                        resources compiled to create statistics and visualizations for further clarity (and sometimes
                        bragging rights).
                    </p>
                    <div className="flex flex-col items-center gap-4">
                        <Image
                            src="/images/screenshots/profile-page-and-export.png"
                            alt="search-bar-highlight"
                            className="border-1 rounded-lg overflow-hidden shadow-sm w-4/5"
                            preview
                            indicatorIcon={<></>}
                        />
                        <Image
                            src="/images/screenshots/profile-charts.png"
                            alt="search-bar-highlight"
                            className="border-1 rounded-lg overflow-hidden shadow-sm w-4/5"
                            preview
                            indicatorIcon={<></>}
                        />
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <h3 className="text-headingLg xs:text-headingMd font-semibold text-black-900 scroll-mt-20" id="edit">
                    Editing A Publication
                </h3>
                <div className="flex flex-col gap-4">
                    <p className="text-bodyLg font-light xs:text-bodyMd">
                        The platform's data extraction/scraping methods are still in their infancies, so we've enabled
                        users to submit publication edits to the Science Portal team. This edit function is only
                        available to logged in users and is made for editing the resources part of a publication. You
                        have the option of both editing, deleting, or adding resources to the packaged publication.
                    </p>
                    <div className="flex flex-col items-center gap-4">
                        <Image
                            src="/images/screenshots/edit-button.png"
                            alt="search-bar-highlight"
                            className="border-1 rounded-lg overflow-hidden shadow-sm w-4/5"
                            preview
                            indicatorIcon={<></>}
                        />
                        <Image
                            src="/images/screenshots/edit-submit-button.png"
                            alt="search-bar-highlight"
                            className="border-1 rounded-lg overflow-hidden shadow-sm w-4/5"
                            preview
                            indicatorIcon={<></>}
                        />
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <h3 className="text-headingLg xs:text-headingMd font-semibold text-black-900 scroll-mt-20" id="submit">
                    Submitting A Publication
                </h3>
                <div className="flex flex-col gap-4">
                    <p className="text-bodyLg font-light xs:text-bodyMd">
                        {' '}
                        To complement the editing function, the Science Portal includes the ability for logged in users
                        to{' '}
                    </p>
                </div>
            </div>
        </div>
    );
};

export const Data: React.FC<SectionProps> = ({ scrollTarget }) => {
    useEffect(() => {
        if (!scrollTarget) return;
        const el = document.getElementById(scrollTarget);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, [scrollTarget]);
    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-heading3Xl xs:text-headingXl font-semibold">Data Sources</h2>
            <div className="flex flex-col gap-2">
                <h3
                    className="text-headingLg xs:text-headingMd font-semibold text-black-900 scroll-mt-20 "
                    id="publications"
                >
                    Publications
                </h3>
                <p className="text-bodyLg font-light xs:text-bodyMd">
                    All of the publications curated in the platform are kindly provided to us by the{' '}
                    <a
                        href="https://universityhealthnetwork.sharepoint.com/teams/ResGrantsAwards/SitePages/About.aspx#research-analytics"
                        target="_blank"
                        className="text-blue-700 font-normal transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
                    >
                        UHN research analytics
                    </a>{' '}
                    team. We receive updates on a rolling monthly basis from the previous month and work to add the new
                    publications to the platform as soon as possible. As we continue to work on refining our application
                    functionalities and backend data processing we have chosen to only import publications from{' '}
                    <span className="font-normal">2018 onwards</span> to the platform. It is also important to note that
                    we only extract the publications from UHN research analytics that are deemed having having a direct
                    affiliation with Princess Margaret.
                </p>
            </div>
            <div className="flex flex-col gap-2">
                <h3
                    className="text-headingLg xs:text-headingMd font-semibold text-black-900 scroll-mt-20 "
                    id="publication-resources"
                >
                    Publication Resources
                </h3>
                <p className="text-bodyLg font-light xs:text-bodyMd">
                    Publication resources are simply any type of resource referenced in a publication that contributed
                    to the executed research. We have developed an algorithm that is able to parse publications via
                    their{' '}
                    <a
                        href="https://www.doi.org/the-identifier/what-is-a-doi/"
                        target="_blank"
                        className="text-blue-700 font-normal transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
                    >
                        DOI
                    </a>{' '}
                    and extract key resources we want to track in the platform. The algorithm we have created is still
                    in its infancies and will continue to get better with every iteration we release. Currently we track
                    various types of code repositories, data repositories, clinical trials, containerized environments,
                    packages, protocols, and results. We do plan to expand our publication resource tracking scope to
                    include more resources such as animal models, protocols, cell lines, and much more.
                </p>
            </div>
            <div className="flex flex-col gap-2">
                <h3
                    className="text-headingLg xs:text-headingMd font-semibold text-black-900 scroll-mt-20 "
                    id="members"
                >
                    Members
                </h3>
                <p className="text-bodyLg font-light xs:text-bodyMd">
                    All of the "members" tracked in the platform <span className="font-normal">(377 faculty)</span> are
                    also provided to us by the UHN research analytics team. Just like publications in the platform we
                    only extract UHN faculty that have a direct affiliation with Princess Margaret.
                </p>
            </div>
            <div className="flex flex-col gap-2">
                <h3
                    className="text-headingLg xs:text-headingMd font-semibold text-black-900 scroll-mt-20 "
                    id="citations"
                >
                    Citations
                </h3>
                <p className="text-bodyLg font-light xs:text-bodyMd">
                    Publication citations in the platform are retrieved from{' '}
                    <a
                        href="https://www.crossref.org/"
                        target="_blank"
                        className="text-blue-700 font-normal transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
                    >
                        Crossref
                    </a>{' '}
                    and cannot be fully relied on for an accurate citation count, but rather a good estimate. Crossref
                    tends to be slightly more liberal with what is considered a citation but it's still useful for
                    getting a good idea of where a publication stands in that regard. All citations updates happen once
                    a month, within the first week.
                </p>
            </div>
        </div>
    );
};

export const Future: React.FC<SectionProps> = ({ scrollTarget }) => {
    useEffect(() => {
        if (!scrollTarget) return;
        const el = document.getElementById(scrollTarget);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, [scrollTarget]);
    return (
        <>
            <div className="flex flex-col gap-4">
                <h2 className="text-heading3Xl xs:text-headingXl font-semibold">How We Can Help You</h2>
                <div className="flex flex-col gap-2">
                    <p className="text-bodyLg font-light xs:text-bodyMd">
                        For scientists and clinicians the science Portal is a great way to track how frequently you
                        share supplementary data (research outputs) in your publication's. The platform also gives
                        insights into how adherent you are to open science principles and let's you anonymously compare
                        your contributions to others in the insitution. The Science Portal empowers researchers to forge
                        impactful collaborations by leveraging a diverse array of platform filters. This system connects
                        users with scientists, clinicians, and academics engaged in research that aligns with their
                        interests and delivers targeted, high-value outputs.
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <h2 className="text-heading3Xl xs:text-headingXl font-semibold">How You Can Help Us</h2>
                <div className="flex flex-col gap-2">
                    <p className="text-bodyLg font-light xs:text-bodyMd">
                        The Science Portal is a forever evolving open source platform that can benefit from the
                        community it strives to serve. If you are an academic from the institution please consider
                        reviewing publications that come from you or your team to verify resource accuracy and add new
                        resources that may have been missed. Also, notify us of any other useful statistics, analytics,
                        or features you'd like to see come to the platform. To request new functionality to the platform
                        please email <a href="mailto:admin@pmscience.ca">admin@pmscience.ca</a> or use the feedback
                        ticketing system on the profile page.
                    </p>
                </div>
            </div>
        </>
    );
};
