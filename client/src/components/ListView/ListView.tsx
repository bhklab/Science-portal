import React, { useState } from 'react';
import { PublicationImage } from '../PublicationImage/PublicationImage';
import Pub from '../../interfaces/Pub';
import PublicationModal from '../PublicationModal/PublicationModal';

interface publications {
    pubs: Pub[];
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

    return (
        <div className="flex flex-col items-center gap-4 justify-center pb-10">
            {pubs.map(pub => (
                <div
                    className="rounded-lg border-1 smd:w-full border-gray-200 shadow-card bg-white flex flex-row justify-between"
                    key={pub.doi}
                >
                    <div className="p-5 w-[644px] smd:w-full border-r-1 border-gray-200">
                        <h2
                            className="text-headingMd mmd:text-headingSm font-semibold min-h-10 mb-2 cursor-pointer hover:underline underline-offset-1"
                            onClick={() => openModal(pub)}
                        >
                            {pub.name.length > 130 ? `${pub.name.substring(0, 130)}...` : pub.name}
                        </h2>
                        <p className="text-bodyMd mmd:text-bodySm mb-2 h-10">
                            {pub.authors.length > 60 ? `${pub.authors.substring(0, 60)}...` : pub.authors}
                        </p>
                        <div className="flex flex-row justify-between items-center">
                            <div className="flex flex-row mmd:flex-col gap-2 mmd:gap-0 text-bodyMd mmd:text-bodySm text-gray-700 font-light">
                                <p>{pub.journal}</p>
                                <p className="mmd:hidden">•</p>
                                <p>{pub.date}</p>
                                <p className="mmd:hidden">•</p>
                                <p>{pub.citations} citations</p>
                            </div>
                            <div className="flex flex-row gap-2 items-center">
                                <a href="https://google.com">
                                    <img
                                        src="/images/assets/doi-icon.svg"
                                        alt="icon"
                                        className="h-6 w-6 mmd:h-5 mmd:w-5"
                                    />
                                </a>
                                <a href="https://google.com">
                                    <img
                                        src="/images/assets/github-icon.svg"
                                        alt="icon"
                                        className="h-6 w-6 mmd:h-5 mmd:w-5"
                                    />
                                </a>
                                <a href="https://google.com">
                                    <img
                                        src="/images/assets/codeocean-icon.svg"
                                        alt="icon"
                                        className="h-6 w-6 mmd:h-5 mmd:w-5"
                                    />
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center items-center align-center px-[20px] py-[25px] w-[156px] h-[156px] mmd:h-[210px] mmd:px-[10px]">
                        <PublicationImage image={pub.image} />
                    </div>
                </div>
            ))}
            <PublicationModal isVisible={isModalVisible} onHide={closeModal} pub={selectedPub} />
        </div>
    );
};
