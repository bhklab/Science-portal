import React, { useState } from 'react';
import { PublicationImage } from '../PublicationImage/PublicationImage';
import Pub from '../../interfaces/Pub';
import PublicationModal from '../PublicationModal/PublicationModal';
import { Tooltip } from 'primereact/tooltip';
import { LINK_CATEGORIES } from '../../interfaces/Links';
import Supplementary from '../../interfaces/Supplementary';

interface publications {
    pubs: Pub[];
}

interface Contains {
    code: boolean;
    container: boolean;
    data: boolean;
    results: boolean;
    trials: boolean;
    miscellaneous: boolean;
}

export const ListView: React.FC<publications> = ({ pubs }) => {
    const [selectedPub, setSelectedPub] = useState<Pub | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const openModal = (pub: Pub) => {
        setSelectedPub(pub);
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
        setSelectedPub(null);
    };

    // Show first and last 3 authors separated by ...
    const formatAuthors = (authorsString: string) => {
        const authorsArray = authorsString.split(';');
        const authorsCount = authorsArray.length;
        if (authorsCount <= 6) {
            return authorsString; // If 6 or fewer authors, return them all
        }
        const firstThreeAuthors = authorsArray.slice(0, 3).join('; ');
        const lastThreeAuthors = authorsArray.slice(-3).join('; ');
        return `${firstThreeAuthors} ...${lastThreeAuthors}`;
    };

    const formatIcons = (pub: Pub) => {
        const supplementary: Supplementary = pub.supplementary;

        // Initialize the 'contains' object to track the presence of links in each category
        let contains: Contains = {
            code: false,
            container: false,
            data: false,
            results: false,
            trials: false,
            miscellaneous: false
        };

        // Map category names to their corresponding icon file paths
        const categoryIcons: Record<string, string> = {
            code: '/images/assets/code-icon.svg',
            containers: '/images/assets/containers-icon.svg',
            data: '/images/assets/data-icon.svg',
            results: '/images/assets/results-icon.svg',
            trials: '/images/assets/clinicaltrials-icon.svg',
            miscellaneous: '/images/assets/miscellaneous-icon.svg'
        };

        Object.entries(LINK_CATEGORIES).forEach(([category, types]) => {
            for (const type of types) {
                if (supplementary[type.name as keyof Supplementary]?.trim()) {
                    contains[category as keyof Contains] = true;
                    break; // Stop checking further types for this category
                }
            }
        });

        // Render icons for categories that have supplementary links
        return (
            <div className="flex flex-row gap-2">
                {Object.entries(contains).map(([category, isPresent]) =>
                    isPresent ? (
                        <img
                            key={category}
                            src={categoryIcons[category]}
                            alt={`${category} icon`}
                            className="w-5 logo"
                            data-pr-tooltip={`Includes ${category} ${category === 'miscellaneous' ? 'data' : ''}`}
                        />
                    ) : null
                )}
            </div>
        );
    };

    return (
        <div className="flex flex-col flex-wrap items-center gap-4 justify-center pb-10">
            <Tooltip target=".logo" position="top" hideDelay={200} />
            {pubs.map(pub => (
                <div
                    className="rounded-lg border-1 smd:w-full border-gray-200 shadow-card bg-white flex flex-row justify-between"
                    key={pub.doi}
                >
                    <div className="p-5 w-[644px] smd:w-full border-r-1 border-gray-200 relative">
                        <h2
                            className="text-headingMd sm:text-headingSm font-semibold mb-2 cursor-pointer hover:underline underline-offset-1 line-clamp-2"
                            onClick={() => openModal(pub)}
                        >
                            {pub.name}
                        </h2>
                        <p className="text-bodyMd sm:text-bodySm mb-2 line-clamp-2">{formatAuthors(pub.authors)}</p>
                        <div className="flex flex-row justify-between items-center w-full absolute bottom-4 left-0 right-0 px-5">
                            <div className="flex flex-row smd:flex-col gap-2 smd:gap-0 text-bodyMd mmd:text-bodySm text-gray-700 font-light align-middle text-pretty">
                                <p className="line-clamp-1 max-h-6 max-w-[285px]">{pub.journal}</p>
                                <p className="smd:hidden align-middle">•</p>
                                <p>{pub.date}</p>
                                <p className="smd:hidden">•</p>
                                <p>{pub.citations} citations</p>
                            </div>
                            {formatIcons(pub)}
                        </div>
                    </div>
                    <div className="flex flex-col justify-center items-center align-center px-[20px] py-[25px] w-[156px] h-[156px] smd:h-[210px] smd:px-[10px]">
                        <PublicationImage image={pub.image} />
                    </div>
                </div>
            ))}
            <PublicationModal isVisible={isModalVisible} onHide={closeModal} pub={selectedPub} />
        </div>
    );
};
