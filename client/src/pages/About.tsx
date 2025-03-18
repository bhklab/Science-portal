import React from 'react';

const About: React.FC = () => {
    return (
        <div className="flex flex-col gap-10 max-w-[800px] mx-auto py-32">
            <h1 className="text-heading3Xl font-bold">About Science Portal</h1>

            <div className="flex flex-col gap-2">
                <h2 className="text-headingLg font-semibold">What is the Science Portal</h2>
                <p className="text-bodyMd">
                    Despite "<span className="font-bold">open science</span>" being essential for scientific progress,
                    research outputs often remain difficult to find, limiting collaboration opportunities and impact.
                    Making research contributions <span className="font-bold">openly</span> accessible requires
                    significant time, resources, and expertise. Once made available, it can still be challenging to
                    track and reward these efforts effectively.
                </p>
                <p className="text-bodyMd">
                    The Science Portal serves as a platform to centralize and simplify access to research outputs at
                    Princess Margaret. The Science Portal trackles common
                    <span className="font-bold"> transparency </span> and
                    <span className="font-bold"> reproducibility </span>issues faced in research by sharing diverse open
                    science contributions and utilizing robust tools to track them.
                </p>
            </div>

            <div className="flex flex-col gap-4">
                <h2 className="text-headingLg font-semibold">How The Science Portal Can Help You</h2>
                <div className="flex flex-col gap-2">
                    <p className="text-bodyMd">
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
                <h2 className="text-headingLg font-semibold">How You Can Help The Science Portal</h2>
                <div className="flex flex-col gap-2">
                    <p className="text-bodyMd">
                        The Science Portal is a forever evolving open source platform that can benefit from the
                        community it strives to serve. If you are a academic from the institution please consider
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
