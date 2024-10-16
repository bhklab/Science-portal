import React, { useState, useEffect } from 'react';
import BlankPub from '../../interfaces/BlankPub';
import { Message } from 'primereact/message';

interface NewPublicationModalProps {
    pub: BlankPub;
    setPub: React.Dispatch<React.SetStateAction<BlankPub>>;
    handleSubmit: (formattedPub: BlankPub) => void;
}

const LINK_CATEGORIES = {
    code: [
        { name: 'github', display: 'Github' },
        { name: 'gitlab', display: 'Gitlab' }
    ],
    data: [
        { name: 'geo', display: 'Gene Expression Omnibus' },
        { name: 'dbGap', display: 'The database of Genotypes and Phenotypes' },
        { name: 'kaggle', display: 'Kaggle' },
        { name: 'dryad', display: 'Dryad' },
        { name: 'empiar', display: 'Electron Microscopy Public Image Archive' },
        { name: 'gigaDb', display: 'GIGADB' },
        { name: 'zenodo', display: 'Zenodo' },
        { name: 'ega', display: 'European Genome-phenome Archive' },
        { name: 'xlsx', display: 'Excel Sheets' },
        { name: 'csv', display: 'Comma-separated Value Files' },
        { name: 'proteinDataBank', display: 'Protein Data Bank' }
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

const NewPublicationModal: React.FC<NewPublicationModalProps> = ({ pub, setPub, handleSubmit }) => {
    const [valid, setValid] = useState(false);

    // Check if the required fields are filled
    useEffect(() => {
        setValid(!!pub.name && !!pub.doi);
    }, [pub.name, pub.doi]);

    // Ensure that supplementary fields are initialized as arrays
    useEffect(() => {
        const initializeSupplementary = () => {
            const updatedSupplementary = { ...pub.supplementary };
            Object.keys(LINK_CATEGORIES).forEach(categoryGroup => {
                LINK_CATEGORIES[categoryGroup].forEach(key => {
                    if (!Array.isArray(updatedSupplementary[key.name])) {
                        updatedSupplementary[key.name] = updatedSupplementary[key.name]
                            ? updatedSupplementary[key.name].split(',').map(link => link.trim())
                            : [];
                    }
                });
            });
            setPub({ ...pub, supplementary: updatedSupplementary });
        };
        initializeSupplementary();
    }, [pub, setPub]);

    // Transform supplementary arrays to comma-separated strings before submission
    const formatSupplementary = () => {
        const formattedSupplementary: { [key: string]: string } = {};
        Object.entries(pub.supplementary).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                formattedSupplementary[key] = value.filter(link => link.trim() !== '').join(', ');
            }
        });
        return formattedSupplementary;
    };

    // Format and pass the formatted publication object to the parent submit handler
    const handleSave = () => {
        const formattedPub = { ...pub, supplementary: formatSupplementary() };
        handleSubmit(formattedPub);
    };

    // Handle addition and modification of supplementary links
    const addNewLink = (key: string) => {
        if (Array.isArray(pub.supplementary[key])) {
            setPub({
                ...pub,
                supplementary: {
                    ...pub.supplementary,
                    [key]: [...(pub.supplementary[key] || []), '']
                }
            });
        }
    };

    const handleLinkChange = (key: string, index: number, value: string) => {
        setPub({
            ...pub,
            supplementary: {
                ...pub.supplementary,
                [key]: pub.supplementary[key]?.map((link: string, idx: number) => (idx === index ? value : link))
            }
        });
    };

    const deleteLink = (key: string, index: number) => {
        setPub({
            ...pub,
            supplementary: {
                ...pub.supplementary,
                [key]: pub.supplementary[key]?.filter((_, idx: number) => idx !== index)
            }
        });
    };

    return (
        <div className="flex flex-col gap-10 py-10 mmd:px-[10px] px-4">
            {/* Publication Fields */}
            <div className="flex flex-col gap-5">
                <FieldSection
                    label="Name"
                    value={pub.name}
                    onChange={value => setPub({ ...pub, name: value })}
                    isRequired
                />
                <FieldSection
                    label="DOI"
                    value={pub.doi}
                    onChange={value => setPub({ ...pub, doi: value })}
                    isRequired
                />
                <FieldSection
                    label="Journal"
                    value={pub.journal}
                    onChange={value => setPub({ ...pub, journal: value })}
                />
                <FieldSection label="Type" value={pub.type} onChange={value => setPub({ ...pub, type: value })} />
                <FieldSection
                    label="Authors"
                    value={pub.authors}
                    onChange={value => setPub({ ...pub, authors: value })}
                />
                <FieldSection
                    label="Affiliations"
                    value={pub.affiliations}
                    onChange={value => setPub({ ...pub, affiliations: value })}
                />
                <FieldSection
                    label="Publisher"
                    value={pub.publisher}
                    onChange={value => setPub({ ...pub, publisher: value })}
                />
            </div>

            {/* Supplementary Links Section */}
            <div className="flex flex-col gap-5 bg-gray-50 border-1 p-5 rounded-md">
                <h2 className="text-headingMd font-medium text-black-900">Supplementary Links</h2>
                {Object.entries(LINK_CATEGORIES).map(([categoryGroup, keys]) => (
                    <div key={categoryGroup} className="flex flex-col gap-5">
                        <h1 className="text-headingXl text-black-900 font-semibold">
                            {capitalizeFirst(categoryGroup)}
                        </h1>
                        {keys.map(key => (
                            <div
                                key={key.name}
                                className="flex flex-col gap-3 rounded-[4px] p-5 bg-gray-50 border-1 border-gray-200 hover:bg-gray-100"
                            >
                                <div className="flex justify-between items-center">
                                    <p className="capitalize">{key.display}</p>
                                    <img
                                        src="/images/assets/plus-icon.svg"
                                        onClick={() => addNewLink(key.name)}
                                        className="cursor-pointer mr-[2px]"
                                        alt={`Add ${key.display}`}
                                    />
                                </div>
                                {Array.isArray(pub.supplementary[key.name]) &&
                                    pub.supplementary[key.name]?.map((link: string, index: number) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <img
                                                src={`/images/assets/${key.name.toLowerCase()}-icon.png`}
                                                alt={key.name}
                                                className="h-6 w-6"
                                            />
                                            <input
                                                type="text"
                                                value={link}
                                                onChange={e => handleLinkChange(key.name, index, e.target.value)}
                                                className="border-2 border-gray-300 p-2 rounded-md w-full"
                                            />
                                            <img
                                                src="/images/assets/trashcan-icon.png"
                                                onClick={() => deleteLink(key.name, index)}
                                                className="cursor-pointer"
                                                alt={`Delete ${key.display}`}
                                            />
                                        </div>
                                    ))}
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {/* Footer Section */}
            <div className="flex justify-end mt-5">
                <button
                    onClick={handleSave}
                    className={`p-3 rounded-md transition-all duration-300 ${valid ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
                    disabled={!valid}
                >
                    Save
                </button>
            </div>
        </div>
    );
};

/* Custom component for each field section */
const FieldSection: React.FC<{
    label: string;
    value: string | undefined;
    onChange: (value: string) => void;
    isRequired?: boolean;
}> = ({ label, value, onChange, isRequired }) => (
    <div className="flex flex-col gap-2">
        <label className="text-headingMd font-medium">
            {label}
            {isRequired && ' *'}
        </label>
        <input
            type="text"
            value={value || ''}
            onChange={e => onChange(e.target.value)}
            className="border-2 border-gray-300 p-2 rounded-md"
        />
        {isRequired && !value && <Message severity="error" text="Required" />}
    </div>
);

const capitalizeFirst = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

export default NewPublicationModal;
