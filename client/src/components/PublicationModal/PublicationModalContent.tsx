import React from 'react';
import Pub from '../../interfaces/Pub';
import { PublicationImage } from '../PublicationImage/PublicationImage';

const PublicationModalContent: React.FC<{ pub: Pub }> = ({ pub }) => {
    const code = ['github', 'gitlab'];
    const data = [
        'geo',
        'dbGap',
        'kaggle',
        'dryad',
        'empiar',
        'gigaDB',
        'zenodo',
        'ega',
        'xlsx',
        'csv',
        'proteinDataBank',
        'dataverse',
        'openScienceframework',
        'finngenGitbook',
        'gtexPortal',
        'ebiAcUk',
        'mendeley'
    ];
    const containers = ['codeOcean', 'colab'];
    const results = ['gsea', 'figshare'];
    const trials = ['clinicalTrial'];
    const miscellanous = ['IEEE', 'pdf', 'docx', 'zip'];
    const supplementary = pub.supplementary as { [key: string]: string | undefined };
    const supplementaryKeys = Object.keys(supplementary);
    const codeLinks = supplementaryKeys.filter(key => code.includes(key) && supplementary[key]);
    const dataLinks = supplementaryKeys.filter(key => data.includes(key) && supplementary[key]);
    const containerLinks = supplementaryKeys.filter(key => containers.includes(key) && supplementary[key]);
    const resultLinks = supplementaryKeys.filter(key => results.includes(key) && supplementary[key]);
    const trialLinks = supplementaryKeys.filter(key => trials.includes(key) && supplementary[key]);
    const miscellanousLinks = supplementaryKeys.filter(key => miscellanous.includes(key) && supplementary[key]);

    const renderLinkSection = (title: string, links: string[]) => (
        <div className="flex flex-col gap-5">
            <h1 className="text-headingXl text-black-900 font-semibold">{title}</h1>
            {links.map(link => {
                const urls = (supplementary[link] || '').split(',').map(url => url.trim());
                return (
                    <div
                        key={link}
                        className="flex flex-col gap-3 rounded-[4px] p-5 bg-gray-50 border-1 border-gray-200 hover:bg-gray-100"
                    >
                        <div className="flex flex-row">
                            <p className="w-full capitalize">{link}</p>
                        </div>

                        {urls.map((url, index) => (
                            <a
                                key={index}
                                href={url}
                                target="_blank"
                                rel="noreferrer"
                                className="flex flex-row gap-2 items-center mt-2 hover:text-blue-500"
                            >
                                <img
                                    src={`/images/assets/${link.toLowerCase()}-icon.png`}
                                    alt={link}
                                    className="h-6 w-6"
                                />
                                <p className="text-bodyMd mmd:text-bodySm break-all">{url}</p>
                                {/* <img src="/images/assets/goto-link-icon.svg" alt="Go to link" className="h-5 w-5" /> */}
                            </a>
                        ))}
                    </div>
                );
            })}
        </div>
    );

    return (
        <div className="flex flex-col gap-10 py-10 mmd:px-[10px] px-[120px]">
            <div className="flex flex-col gap-5 pb-10 border-b-2 border-gray-200 mmd:justify-center mmd:items-center ">
                <div className="h-48 w-48 md:h-[120px] md:w-[120px] overflow-hidden border-2 border-gray-200 rounded-lg flex justify-center items-center bg-white">
                    <PublicationImage image={pub.image} />
                </div>
                <div className="flex flex-col gap-2">
                    <h1 className="md:text-headingMd text-heading2Xl font-semibold text-black-900 mmd:text-center">
                        {pub.name}
                    </h1>
                    <p className="md:text-bodySm mmd:text-center font-light">{pub.authors}</p>
                    <div className="flex mmd:flex-col flex-row gap-2 mmd:gap-0 text-bodyMd md:text-bodySm text-gray-700 font-light mmd:text-center">
                        <p>{pub.journal}</p>
                        <p className="mmd:hidden">•</p>
                        <p>{pub.date}</p>
                        <p className="mmd:hidden">•</p>
                        <p>{pub.citations} citations</p>
                    </div>
                </div>
                <div className="flex flex-col gap-3 rounded-[4px] p-5 bg-gray-50 border-1 border-gray-200 w-full hover:bg-gray-100 hover:text-gray">
                    <div className="flex flex-row">
                        <p className="w-full">Digital Object Identifier</p>
                    </div>
                    <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noreferrer">
                        <div className="flex flex-row gap-2 items-center hover:text-blue-500">
                            <img src="/images/assets/doi-icon.svg" alt="Doi" className="h-6 w-6" />
                            <p className="text-bodyMd mmd:text-bodySm break-all">https://doi.org/{pub.doi}</p>
                            {/* <img src="/images/assets/goto-link-icon.svg" alt="Go to link" className="h-5 w-5" /> */}
                        </div>
                    </a>
                </div>
            </div>
            {codeLinks.length > 0 && renderLinkSection('Code', codeLinks)}
            {dataLinks.length > 0 && renderLinkSection('Data', dataLinks)}
            {containerLinks.length > 0 && renderLinkSection('Containers', containerLinks)}
            {trialLinks.length > 0 && renderLinkSection('Trials', trialLinks)}
            {resultLinks.length > 0 && renderLinkSection('Results', resultLinks)}
            {miscellanousLinks.length > 0 && renderLinkSection('Miscellanous', miscellanousLinks)}
        </div>
    );
};

export default PublicationModalContent;
