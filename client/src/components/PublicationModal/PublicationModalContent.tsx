import React from 'react';
import Pub from '../../interfaces/Pub';
import { PublicationImage } from '../PublicationImage/PublicationImage';

const PublicationModalContent: React.FC<{ pub: Pub }> = ({ pub }) => {
    const repositories = ['github', 'codeOcean', 'gitlab'];
    const supplementary = pub.supplementary as { [key: string]: string | undefined };
    const supplementaryKeys = Object.keys(supplementary);
    const repositoryLinks = supplementaryKeys.filter(key => repositories.includes(key) && supplementary[key]);
    const dataLinks = supplementaryKeys.filter(key => !repositories.includes(key) && supplementary[key]);

    console.log(repositoryLinks, dataLinks, supplementary); // Debug log

    const renderLinkSection = (title: string, links: string[]) => (
        <div className="flex flex-col gap-5">
            <h1 className="text-headingXl text-black-900 font-semibold">{title}</h1>
            {links.map(link => {
                const url = supplementary[link];
                return url ? (
                    <a href={url} target="_blank" rel="noreferrer">
                        <div
                            key={link}
                            className="flex flex-col gap-3 rounded-[4px] p-5 bg-gray-50 border-1 border-gray-200 hover:bg-gray-100"
                        >
                            <div className="flex flex-row">
                                <p className="w-full capitalize">{link}</p>
                                <img src="/images/assets/goto-link-icon.svg" alt="Go to link" className="h-6 w-6" />
                            </div>

                            <div className="flex flex-row gap-2 items-center">
                                <img
                                    src={
                                        link === 'github' || link === 'gitlab' || link === 'codeOcean'
                                            ? `/images/assets/${link.toLowerCase()}-icon.svg`
                                            : `/images/assets/link-icon.svg`
                                    }
                                    alt={link}
                                    className="h-6 w-6"
                                />{' '}
                                <p className="text-bodyMd mmd:text-bodySm break-all">{url}</p>
                            </div>
                        </div>
                    </a>
                ) : null;
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
                <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noreferrer">
                    <div className="flex flex-col gap-3 rounded-[4px] p-5 bg-gray-50 border-1 border-gray-200 w-full hover:bg-gray-100 hover:text-gray">
                        <div className="flex flex-row">
                            <p className="w-full">Digital Object Identifier</p>
                            <img src="/images/assets/goto-link-icon.svg" alt="Go to link" className="h-6 w-6" />
                        </div>

                        <div className="flex flex-row gap-2 items-center">
                            <img src="/images/assets/doi-icon.svg" alt="Doi" className="h-6 w-6" />
                            <p className="text-bodyMd mmd:text-bodySm break-all">https://doi.org/{pub.doi}</p>
                        </div>
                    </div>
                </a>
            </div>
            {repositoryLinks.length > 0 && renderLinkSection('Repositories', repositoryLinks)}
            {dataLinks.length > 0 && renderLinkSection('Data', dataLinks)}
        </div>
    );
};

export default PublicationModalContent;
