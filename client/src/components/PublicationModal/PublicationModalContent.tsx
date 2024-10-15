import React, { useState } from 'react';
import Pub from '../../interfaces/Pub';
import { PublicationImage } from '../PublicationImage/PublicationImage';
import { Tooltip } from 'primereact/tooltip';
import axios from 'axios';

const LINK_CATEGORIES = {
    code: [
        {
            name: 'github',
            display: 'Github'
        },
        { name: 'gitlab', display: 'Gitlab' }
    ],
    data: [
        { name: 'geo', display: 'Gene Expression Omnibus' },
        { name: 'dbGap', display: 'The database of Genotypes and Phenotypes' },
        { name: 'kaggle', display: 'Kaggle' },
        { name: 'dryad', display: 'Dryad' },
        { name: 'empiar', display: 'Electron Microscopy Public Image Archive' },
        { name: 'gigaDB', display: 'GIGADB' },
        { name: 'zenodo', display: 'Zenodo' },
        { name: 'ega', display: 'European Genome-phenome Archive' },
        { name: 'xlsx', display: 'Excel Sheets' },
        { name: 'csv', display: 'Comma-separated Value Files' },
        { name: 'proteinDataBank', display: 'Protein Data Bank' },
        { name: 'dataverse', display: 'Dataverse' },
        { name: 'openScienceframework', display: 'Open Science Framework' },
        { name: 'finngenGitbook', display: 'FinnGen Gitbook' },
        { name: 'gtexPortal', display: 'Genotype-Tissue Expression Portal' },
        { name: 'ebiAcUk', display: 'European Bioinformatics Institute' },
        { name: 'mendeley', display: 'Mendeley ' }
    ],
    containers: [
        { name: 'codeOcean', display: 'Code Ocean Capsules' },
        { name: 'colab', display: 'Google Colab Capsules' }
    ],
    results: [
        { name: 'gsea', display: 'Gene Set Enrichment Analysis' },
        { name: 'figshare', display: 'Figshare' }
    ],
    trials: [{ name: 'clinicalTrial', display: 'Clinical Trials' }],
    miscellaneous: [
        { name: 'IEEE', display: 'Institute of Electrical and Electronics Engineers' },
        { name: 'pdf', display: 'PDFs' },
        { name: 'docx', display: 'Word Documents' },
        { name: 'zip', display: 'Compressed Files' }
    ]
};

const PublicationModalContent: React.FC<{ pub: Pub }> = ({ pub }) => {
    const [editMode, setEditMode] = useState(false);
    const [links, setLinks] = useState<{ [key: string]: string[] }>(() => initializeLinks(pub.supplementary));
    const [error, setError] = useState('');

    const handleLinkChange = (category: string, index: number, value: string) => {
        setLinks(prevLinks => {
            const updatedLinks = { ...prevLinks };
            updatedLinks[category][index] = value;
            return updatedLinks;
        });
    };

    const addNewLink = (category: string) => {
        setLinks(prevLinks => ({
            ...prevLinks,
            [category]: [...(prevLinks[category] || []), '']
        }));
    };

    const deleteLink = (category: string, index: number) => {
        setLinks(prevLinks => {
            const updatedLinks = { ...prevLinks };
            updatedLinks[category] = updatedLinks[category].filter((_, idx) => idx !== index);
            return updatedLinks;
        });
    };

    const handleSubmit = async () => {
        try {
            const formattedSupplementary = Object.fromEntries(
                Object.entries(links).map(([key, value]) => [key, value.join(', ')])
            );

            await axios.post('/api/publications/changes', {
                ...pub,
                supplementary: formattedSupplementary,
                dateAdded: new Date().toISOString(),
                originalId: pub._id
            });

            setEditMode(false);
        } catch (err) {
            console.error('Submission Error:', err);
        }
    };

    return (
        <div className="flex flex-col gap-10 py-10 mmd:px-[10px] px-[120px]">
            <HeaderSection
                name={pub.name}
                authors={pub.authors}
                journal={pub.journal}
                date={pub.date}
                citations={pub.citations}
                image={pub.image}
                doi={pub.doi}
                editMode={editMode}
                setEditMode={setEditMode}
            />

            {/* Render Link Categories */}
            <div className="flex flex-col gap-5">
                {Object.entries(LINK_CATEGORIES).map(([categoryGroup, keys]) => {
                    // Determine if the entire group should be visible based on whether any subcategories have non-empty links
                    const groupHasValidLinks = keys.some(key => isNonEmptyArray(links[key.name]));

                    // Skip rendering the group header and subcategories if no subcategory has a valid link and edit mode is not enabled
                    if (!editMode && !groupHasValidLinks) return null;

                    const firstValidCategory = keys.find(key => isNonEmptyArray(links[key.name]));

                    return (
                        <div key={categoryGroup} className="flex flex-col gap-5">
                            <h1 className="text-headingXl text-black-900 font-semibold">
                                {capitalizeFirst(categoryGroup)}
                            </h1>
                            {keys.map(key => {
                                // Show subcategories in edit mode or show only the first valid subcategory in non-edit mode
                                const showCategory =
                                    editMode || (firstValidCategory === key && isNonEmptyArray(links[key.name]));

                                if (!showCategory) return null;

                                return (
                                    <div
                                        key={key.name}
                                        className="flex flex-col gap-3 rounded-[4px] p-5 bg-gray-50 border-1 border-gray-200 hover:bg-gray-100"
                                    >
                                        <div className="flex justify-between items-center">
                                            <p className="capitalize">{key.display}</p>
                                            {editMode && (
                                                <img
                                                    src="/images/assets/plus-icon.png"
                                                    onClick={() => addNewLink(key.name)}
                                                    className="cursor-pointer mr-[2px]"
                                                />
                                            )}
                                        </div>

                                        {/* Render Links */}
                                        {links[key.name]?.map((link, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <img
                                                    src={`/images/assets/${key.name.toLowerCase()}-icon.png`}
                                                    alt={key.name}
                                                    className="h-6 w-6"
                                                />
                                                {editMode ? (
                                                    <>
                                                        <input
                                                            type="text"
                                                            value={link}
                                                            onChange={e =>
                                                                handleLinkChange(key.name, index, e.target.value)
                                                            }
                                                            className="border-2 border-gray-300 p-2 rounded-md w-full"
                                                        />
                                                        <img
                                                            src="/images/assets/trashcan-icon.png"
                                                            onClick={() => deleteLink(key.name, index)}
                                                            className="cursor-pointer"
                                                        />
                                                    </>
                                                ) : (
                                                    <a
                                                        href={link}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-bodyMd mmd:text-bodySm break-all hover:text-blue-500"
                                                    >
                                                        {link}
                                                    </a>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}

                {/* Submit Button */}
                {editMode && (
                    <div className="flex justify-end mt-5">
                        <button
                            onClick={handleSubmit}
                            className="bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700"
                        >
                            Submit Changes
                        </button>
                    </div>
                )}

                {/* Error Message */}
                {error && <p className="text-red-500">{error}</p>}
            </div>
        </div>
    );
};

// Utility function to check if an array has non-empty values
const isNonEmptyArray = (arr: string[]) => Array.isArray(arr) && arr.length > 0 && arr.some(link => link.trim() !== '');

// Initialize links from supplementary data
const initializeLinks = (supplementary: { [key: string]: string | undefined }) => {
    const links: { [key: string]: string[] } = {};
    Object.entries(supplementary || {}).forEach(([key, value]) => {
        links[key] = value ? value.split(',').map(link => link.trim()) : [];
    });
    return links;
};

// Header Section Component
const HeaderSection: React.FC<{
    name: string;
    authors: string;
    journal: string;
    date: string;
    citations: number;
    image: string;
    doi: string;
    editMode: boolean;
    setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ name, authors, journal, date, citations, image, doi, editMode, setEditMode }) => (
    <div className="flex flex-col gap-5 pb-10 border-b-2 border-gray-200 mmd:justify-center mmd:items-center">
        <div className="flex justify-between">
            <div className="h-48 w-48 md:h-[120px] md:w-[120px] overflow-hidden border-2 border-gray-200 rounded-lg flex justify-center items-center bg-white">
                <PublicationImage image={image} />
            </div>

            {/* Edit Mode Button */}
            <div className="flex justify-end pr-5">
                <Tooltip target=".adjust-icon" />
                <img
                    src="/images/assets/adjust-icon.png"
                    className="w-12 h-12 adjust-icon hover:scale-110 hover:opacity-80 cursor-pointer transition duration-300"
                    data-pr-tooltip="Edit supplementary data"
                    data-pr-position="right"
                    style={{ fontSize: '2.0rem' }}
                    onClick={() => setEditMode(!editMode)}
                />
            </div>
        </div>
        <div className="flex flex-col gap-2">
            <h1 className="md:text-headingMd text-heading2Xl font-semibold text-cyan-900 mmd:text-center">{name}</h1>
            <p className="md:text-bodySm mmd:text-center font-light">{authors}</p>
            <div className="flex mmd:flex-col flex-row gap-2 mmd:gap-0 text-bodyMd md:text-bodySm text-gray-700 font-light mmd:text-center">
                <p>{journal}</p>
                <p className="mmd:hidden">•</p>
                <p>{date}</p>
                <p className="mmd:hidden">•</p>
                <p>{citations} citations</p>
            </div>
        </div>
        <DigitalObjectIdentifier doi={doi} />
    </div>
);

// Component for the DOI
const DigitalObjectIdentifier: React.FC<{ doi: string }> = ({ doi }) => (
    <div className="flex flex-col gap-3 rounded-[4px] p-5 bg-gray-50 border-1 border-gray-200 w-full hover:bg-gray-100 hover:text-gray">
        <div className="flex flex-row">
            <p className="w-full">Digital Object Identifier</p>
        </div>
        <a href={`https://doi.org/${doi}`} target="_blank" rel="noreferrer">
            <div className="flex flex-row gap-2 items-center hover:text-blue-500">
                <img src="/images/assets/doi-icon.svg" alt="Doi" className="h-6 w-6" />
                <p className="text-bodyMd mmd:text-bodySm break-all">https://doi.org/{doi}</p>
            </div>
        </a>
    </div>
);

const capitalizeFirst = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

export default PublicationModalContent;
