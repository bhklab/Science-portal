import React, { useState, useEffect } from 'react';
import { PublicationImage } from '../PublicationImage/PublicationImage';
import Pub from '../../interfaces/Pub';
import PublicationModal from '../PublicationModal/PublicationModal';
import { Tooltip } from 'primereact/tooltip';
import { LINK_CATEGORIES } from '../../interfaces/Links';
import Supplementary from '../../interfaces/Supplementary';
import Author from '../../interfaces/Author';
import axios from 'axios';

interface Publications {
    pubs: Pub[];
}

interface Contains {
    [key: string]: boolean;
}

export const CardView: React.FC<Publications> = ({ pubs }) => {
    const [selectedPub, setSelectedPub] = useState<Pub | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [scientists, setScientists] = useState<Author[]>([]);

    const openModal = (pub: Pub) => {
        setSelectedPub(pub);
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
        setSelectedPub(null);
    };

    const formatAuthors = (authorsString: string) => {
        const authorsArray = authorsString.split(';');
        const authorsCount = authorsArray.length;
        if (authorsCount <= 6) {
            return authorsString;
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
        <div className="flex flex-row flex-wrap items-center gap-4 justify-center pb-10">
            <Tooltip target=".logo" position="top" hideDelay={200} />
            {pubs.map(pub => (
                <div
                    className="flex flex-col w-[318px] h-[440px] rounded-lg shadow-card border-1 border-gray-200 bg-white relative"
                    key={pub.doi}
                >
                    <div className="h-48 w-[318px] px-8 py-8 flex flex-col justify-center items-center border-b-1 border-gray-200">
                        <PublicationImage image={pub.image} />
                    </div>
                    <div className="p-5 flex flex-col justify-between">
                        <div>
                            <h2
                                className="text-headingMd md:text-headingSm font-semibold min-h-10 md:min-h-0 mb-2 cursor-pointer hover:underline underline-offset-1 line-clamp-2"
                                onClick={() => openModal(pub)}
                            >
                                {pub.name}
                            </h2>
                            <p className="text-bodyMd md:text-bodySm min-h-10 md:min-h-0 line-clamp-3">
                                {formatAuthors(pub.authors)}
                            </p>
                        </div>
                        <div className="flex flex-row justify-between items-end w-[280px] absolute bottom-4">
                            <div className="flex flex-col gap-1 text-bodyMd text-gray-700 font-normal">
                                <p className="max-w-[140px] line-clamp-2">{pub.journal}</p>
                                <p>{pub.date}</p>
                                <p>{pub.citations} citations</p>
                            </div>
                            {formatIcons(pub)}
                        </div>
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
