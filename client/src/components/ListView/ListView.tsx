import React, { useState, useEffect } from 'react';
import { PublicationImage } from '../PublicationImage/PublicationImage';
import Pub from '../../interfaces/Pub';
import PublicationModal from '../PublicationModal/PublicationModal';
import { Tooltip } from 'primereact/tooltip';
import { LINK_CATEGORIES } from '../../interfaces/Links';
import Supplementary from '../../interfaces/Supplementary';
import Author from '../../interfaces/Author';
import axios from 'axios';

interface publications {
    pubs: Pub[];
}

interface Contains {
    [key: string]: boolean;
}

export const ListView: React.FC<publications> = ({ pubs }) => {
    const [selectedPub, setSelectedPub] = useState<Pub | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [scientists, setScientists] = useState<Author[]>([]);

    console.log(pubs);

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
        let contains: Contains = {};

        const categoryIcons: Record<string, string> = {
            code: '/images/assets/code-icon.svg',
            containers: '/images/assets/containers-icon.svg',
            data: '/images/assets/data-icon.svg',
            results: '/images/assets/results-icon.svg',
            trials: '/images/assets/clinicaltrials-icon.svg',
            protocols: '/images/assets/protocols-icon.svg',
            packages: '/images/assets/packages-icon.svg',
            miscellaneous: '/images/assets/miscellaneous-icon.svg'
        };

        Object.entries(LINK_CATEGORIES).forEach(([category, types]) => {
            if (supplementary[category as keyof Supplementary]) {
                contains[category] = Object.values(supplementary[category as keyof Supplementary]!).some(
                    links => Array.isArray(links) && links.length > 0
                );
            }
        });

        return (
            <div className="flex flex-row gap-2">
                {Object.entries(contains).map(([category, isPresent]) =>
                    isPresent ? (
                        <img
                            key={category}
                            src={categoryIcons[category]}
                            alt={`${category} icon`}
                            className="w-[18px] logo"
                            data-pr-tooltip={`Includes ${category}`}
                        />
                    ) : null
                )}
            </div>
        );
    };

    // Fetch authors on load
    useEffect(() => {
        const getScientists = async () => {
            try {
                const res = await axios.get(`/api/authors/all`);
                setScientists(
                    res.data.map((scientist: Author) => ({
                        ...scientist,
                        fullName: `${scientist.lastName}, ${scientist.firstName}`
                    }))
                );
            } catch (error) {
                console.log(error);
            }
        };
        getScientists();
    }, []);

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
            <PublicationModal
                isVisible={isModalVisible}
                onHide={closeModal}
                pub={selectedPub}
                scientists={scientists}
            />
        </div>
    );
};
