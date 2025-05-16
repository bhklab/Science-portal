import React from 'react';

const About: React.FC = () => {
    return (
        <div className="flex flex-col gap-10 max-w-[800px] mx-auto py-32 text-black-900">
            <div className="flex flex-col gap-2">
                <h2 className="text-heading3Xl font-semibold">What is the Science Portal</h2>
                <p className="text-bodyLg">
                    Despite "<span className="font-bold">open science</span>" being essential for scientific progress,
                    research outputs often remain difficult to find, limiting collaboration opportunities and impact.
                    Making research contributions <span className="font-bold">openly</span> accessible requires
                    significant time, resources, and expertise. Once made available, it can still be challenging to
                    track and reward these efforts effectively.
                </p>
                <p className="text-bodyLg">
                    The Science Portal serves as a platform to centralize and simplify access to research outputs at
                    Princess Margaret. The Science Portal tackles common
                    <span className="font-bold"> transparency </span> and
                    <span className="font-bold"> reproducibility </span>issues faced in research by sharing diverse open
                    science contributions and utilizing robust tools to track them.
                </p>
            </div>
            <div className="flex flex-col gap-1 w-full ">
                <iframe
                    height="400"
                    src="https://www.youtube.com/embed/L6UxPbZcgmY"
                    title="Science Portal Demo"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="border-1"
                />
                <p className="text-bodySm">
                    0:00 - Intro | 1:11 - Search Functionality | 2:09 - Publication Overview | 2:57 - Public Statistics
                    | 3:37 - Profile Page and Personal Statistics | 7:06 - Submit a publication | 7:56 - Edit a
                    publication
                </p>
            </div>

            <div className="flex flex-col gap-4">
                <h2 className="text-heading3Xl font-semibold">Data Sources</h2>
                <div className="flex flex-col gap-2">
                    <h3 className="text-headingLg font-semibold text-gray-700">Publications</h3>
                    <p className="text-bodyLg">
                        All of the publications curated in the platform are kindly provided to us by the
                        <a
                            href="https://universityhealthnetwork.sharepoint.com/teams/ResGrantsAwards/SitePages/About.aspx#research-analytics"
                            target="_blank"
                            className="text-blue-700 font-normal transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
                        >
                            {' '}
                            UHN research analytics
                        </a>{' '}
                        team. We receive updates on a rolling monthly basis from the previous month and work to add the
                        new publications to the platform as soon as possible. As we continue to work on refining our
                        application functionalities and backend data processing we have chosen to only import
                        publications from <span className="font-bold">2018 onwards</span> to the platform. It is also
                        important to note that we only extract the publications from UHN research analytics that are
                        deemed having having a direct affiliation with Princess Margaret.
                    </p>
                </div>
                <div className="flex flex-col gap-2">
                    <h3 className="text-headingLg font-semibold text-gray-700">Members</h3>
                    <p className="text-bodyLg">
                        All of the "members" tracked in the platform (377 faculty) are also provided to us by the UHN
                        research analytics team. Just like publications in the platform we only extract UHN faculty that
                        have a direct affiliation with Princess Margaret.
                    </p>
                </div>
                <div className="flex flex-col gap-2">
                    <h3 className="text-headingLg font-semibold text-gray-700">Citations</h3>
                    <p className="text-bodyLg">
                        Publication citations in the platform are retrieved from{' '}
                        <a
                            href="https://www.crossref.org/"
                            target="_blank"
                            className="text-blue-700 font-normal transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
                        >
                            Crossref
                        </a>{' '}
                        and cannot be fully relied on for an accurate citation count, but rather a good estimate.
                        Crossref tends to be slightly more liberal with what is considered a citation but it's still
                        useful for getting a good idea of where a publication stands in that regard. All citations
                        updates happen once a month, within the first week.
                    </p>
                </div>
                <div className="flex flex-col gap-2">
                    <h3 className="text-headingLg font-semibold text-gray-700">Publication Resources</h3>
                    <p className="text-bodyLg">
                        Publication resources are simply any type of resource referenced in a publication that
                        contributed to the executed research. We have developed an algorithm that is able to parse
                        publications via their DOI and extract key resources we want to track in the platform. The
                        algorithm we have created is still in its infancies and will continue to get better with every
                        iteration we release. Currently we track various types of code repositories, data repositories,
                        clinical trials, containerized environments, packages, protocols, and results. We do plan to
                        expand our publication resource tracking scope to include more resources such as animal models,
                        protocols, cell lines, and much more.
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <h2 className="text-heading3Xl font-semibold">How The Science Portal Can Help You</h2>
                <div className="flex flex-col gap-2">
                    <p className="text-bodyLg">
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
                <h2 className="text-heading3Xl font-semibold">How You Can Help The Science Portal</h2>
                <div className="flex flex-col gap-2">
                    <p className="text-bodyLg">
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
        </div>
    );
};

export default About;
