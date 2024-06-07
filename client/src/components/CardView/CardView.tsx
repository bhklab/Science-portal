import React, { useState } from 'react';
import { PublicationImage } from '../PublicationImage/PublicationImage';
import Pub from '../../interfaces/Pub';
import PublicationModal from '../PublicationModal/PublicationModal';

interface publications {
    pubs: Pub[];
}

export const CardView: React.FC<publications> = ({ pubs }) => {
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
        <div className="flex flex-row flex-wrap gap-4 justify-center pb-10">
            {pubs.map(pub => (
                <div
                    className="flex flex-col w-[318px] rounded-lg shadow-card border-1 border-gray-200 bg-white"
                    key={pub.doi}
                >
                    <div className="h-48 w-[318px] px-8 py-12 flex flex-col justify-center items-center border-b-1 border-gray-200">
                        <PublicationImage image={pub.image} />
                    </div>
                    <div className="p-5 flex flex-col justify-between">
                        <div>
                            <h2
                                className="text-headingMd font-semibold mb-2 cursor-pointer hover:underline underline-offset-1"
                                onClick={() => openModal(pub)}
                            >
                                {pub.name.length > 50 ? `${pub.name.substring(0, 50)}...` : pub.name}
                            </h2>
                            <p className="text-bodyMd mb-4 h-10">
                                {pub.authors.length > 60 ? `${pub.authors.substring(0, 60)}...` : pub.authors}
                            </p>
                        </div>
                        <div className="flex flex-row justify-between items-end">
                            <div className="flex flex-col gap-1 text-bodyMd text-gray-700 font-normal">
                                <p>{pub.journal}</p>
                                <p>{pub.date}</p>
                                <p>{pub.citations} citations</p>
                            </div>
                            <div className="flex flex-row gap-2">
                                <a href="https://www.google.com" target="_blank" rel="noreferrer">
                                    <img src="/images/assets/doi-icon.svg" alt="icon" className="h-6 w-6" />
                                </a>
                                <a href="https://www.google.com" target="_blank" rel="noreferrer">
                                    <img src="/images/assets/github-icon.svg" alt="icon" className="h-6 w-6" />
                                </a>
                                <a href="https://www.google.com" target="_blank" rel="noreferrer">
                                    <img src="/images/assets/codeocean-icon.svg" alt="icon" className="h-6 w-6" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            <PublicationModal isVisible={isModalVisible} onHide={closeModal} pub={selectedPub} />
        </div>
    );
};
