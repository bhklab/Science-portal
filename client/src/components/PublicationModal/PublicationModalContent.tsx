import React, { useState, useRef, useContext } from 'react';
import { Toast } from 'primereact/toast';
import axios from 'axios';
import Pub from '../../interfaces/Pub';
import { PublicationImage } from '../PublicationImage/PublicationImage';
import { LINK_CATEGORIES } from '../../interfaces/Links';
import { AuthContext } from '../../hooks/AuthContext';

interface PublicationModalContentProps {
    pub: Pub;
    editMode: boolean;
    setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
}

interface LinksState {
    [category: string]: {
        [subCategory: string]: string[];
    };
}

const PublicationModalContent: React.FC<PublicationModalContentProps> = ({ pub, editMode, setEditMode }) => {
    const [links, setLinks] = useState<LinksState>(() => initializeLinks({ ...pub.supplementary }));
    const [otherLinks, setOtherLinks] = useState<Pub['otherLinks']>(pub.otherLinks ?? []);

    const toast = useRef<Toast>(null);
    const authContext = useContext(AuthContext);

    // ---- Manage changes in the "supplementary" links ----
    const handleLinkChange = (category: string, subCategory: string, index: number, value: string) => {
        setLinks(prevLinks => {
            const updatedLinks = { ...prevLinks };
            updatedLinks[category][subCategory][index] = value;
            return updatedLinks;
        });
    };

    const addNewLink = (category: string, subCategory: string) => {
        setLinks(prevLinks => ({
            ...prevLinks,
            [category]: {
                ...prevLinks[category],
                [subCategory]: [...(prevLinks[category]?.[subCategory] || []), '']
            }
        }));
    };

    const deleteLink = (category: string, subCategory: string, index: number) => {
        setLinks(prevLinks => {
            const updatedLinks = { ...prevLinks };
            updatedLinks[category][subCategory] = updatedLinks[category][subCategory].filter((_, i) => i !== index);
            return updatedLinks;
        });
    };

    // ---- Manage changes in the "otherLinks" array ----
    const addNewOtherLink = () => {
        setOtherLinks(prev => [...(prev ?? []), { name: '', description: '', link: '' }]);
    };

    const handleOtherLinkChange = (index: number, field: keyof Pub['otherLinks'][number], value: string) => {
        setOtherLinks(prev => {
            const updated = [...(prev ?? [])];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const deleteOtherLink = (index: number) => {
        setOtherLinks(prev => {
            return (prev ?? []).filter((_, i) => i !== index);
        });
    };

    // Handle submission
    const handleSubmit = async () => {
        // Create a new object to submit (avoid sending _id)
        const backendPub: Pub = { ...pub };
        delete backendPub._id;

        // Check if changes occurred
        const supplementaryChanged = JSON.stringify(links) !== JSON.stringify(pub.supplementary);
        const otherLinksChanged = JSON.stringify(otherLinks) !== JSON.stringify(pub.otherLinks);

        if (supplementaryChanged || otherLinksChanged) {
            try {
                await axios.post('/api/publications/changes', {
                    ...backendPub,
                    supplementary: links,
                    otherLinks: otherLinks,
                    dateAdded: new Date().toISOString(),
                    originalId: pub._id,
                    submitterEmail: authContext?.user.email
                });

                toast.current?.show({
                    severity: 'success',
                    summary: 'Publication Update',
                    detail: 'Request to update publication entry has been submitted',
                    life: 8000
                });

                setEditMode(false);
            } catch (err) {
                console.error('Submission Error:', err);
            }
        } else {
            // If nothing changed, just close edit mode
            setEditMode(false);
        }
    };

    return (
        <div>
            {/* Edit mode banner */}
            {editMode && (
                <div className="flex flex-row justify-center align-center p-2.5 gap-2.5 bg-yellow-1000 sticky top-0">
                    <p className="flex items-center justify-center text-bodyMd text-yellow-1200">
                        You're editing links in this article.
                    </p>
                    <button
                        onClick={() => handleSubmit()}
                        className="flex flex-row text-headingSm p-2 border-1 border-yellow-1100 rounded-md shadow-sm justify-center align-center gap-1"
                    >
                        <img src="/images/assets/submit-check-icon.svg" alt="submit checkmark" />
                        <span className="text-yellow-1200">Submit changes</span>
                    </button>
                </div>
            )}

            <div className="flex flex-col gap-10 py-10 mmd:px-[10px] px-[120px]">
                {/* Header Section */}
                <HeaderSection
                    name={pub.name}
                    authors={pub.authors}
                    journal={pub.journal}
                    date={pub.date}
                    citations={pub.citations}
                    image={pub.image}
                    doi={pub.doi}
                />

                {/* Render Link Categories */}
                <div className="flex flex-col gap-5">
                    {Object.entries(LINK_CATEGORIES).map(([categoryGroup, keys]) => {
                        // Check if group has valid links. For "otherLinks," handle separately.
                        const groupHasValidLinks = keys.some(key => {
                            if (key.name === 'otherLinks') {
                                return isNonEmptyOtherLinksArray(otherLinks);
                            }
                            return isNonEmptyArray(links[categoryGroup]?.[key.name]);
                        });

                        // If not in edit mode and no valid links, skip
                        if (!editMode && !groupHasValidLinks) return null;

                        return (
                            <div key={categoryGroup} className="flex flex-col gap-5">
                                <h1 className="text-headingXl text-black-900 font-semibold">
                                    {capitalizeFirst(categoryGroup)}
                                </h1>

                                {editMode && (
                                    <>
                                        {/* Pills for adding new links */}
                                        <div className="flex flex-col gap-4">
                                            <p className="text-headingSm font-medium text-gray-700">
                                                Add all relevant resource types
                                            </p>
                                            <div className="flex flex-row flex-wrap gap-2">
                                                {keys.map(key => {
                                                    // If it's otherLinks, check length on the array.
                                                    const isExisting =
                                                        key.name === 'otherLinks'
                                                            ? otherLinks.length > 0
                                                            : Boolean(links[categoryGroup]?.[key.name]?.length);

                                                    return (
                                                        <button
                                                            key={key.name}
                                                            onClick={() => {
                                                                if (key.name === 'otherLinks') {
                                                                    addNewOtherLink();
                                                                } else {
                                                                    addNewLink(categoryGroup, key.name);
                                                                }
                                                            }}
                                                            className={`flex flex-row gap-1 justify-center items-center p-3 text-headingMd rounded-full font-medium bg-gray-50 border-gray-200 ${
                                                                isExisting ? 'text-black-900' : 'text-gray-700'
                                                            }`}
                                                        >
                                                            {isExisting ? (
                                                                <>
                                                                    <img
                                                                        src="/images/assets/checkmark-icon.svg"
                                                                        alt="Checkmark"
                                                                        className="inline-block"
                                                                    />
                                                                    {key.display}
                                                                </>
                                                            ) : (
                                                                key.display
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Existing links */}
                                <div className="flex flex-col gap-3">
                                    <div className="flex flex-col gap-5">
                                        {keys.map(key => {
                                            if (key.name === 'otherLinks') {
                                                // Render the "otherLinks" array
                                                if (otherLinks.length === 0) return null;

                                                return (
                                                    <div
                                                        key={key.name}
                                                        className="flex flex-col gap-3 rounded-[4px] p-5 bg-gray-50 border-1 border-gray-200 w-full hover:bg-gray-100 hover:text-gray"
                                                    >
                                                        <div className="flex justify-between items-center">
                                                            <p className="capitalize">{key.display}</p>
                                                            {editMode && (
                                                                <img
                                                                    src="/images/assets/plus-icon.svg"
                                                                    alt="Add Link"
                                                                    className="cursor-pointer"
                                                                    onClick={() => addNewOtherLink()}
                                                                />
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col gap-3">
                                                            {otherLinks.map((item, index) =>
                                                                editMode ? (
                                                                    <div
                                                                        key={`otherLinks-${index}`}
                                                                        className="flex flex-col gap-2 p-3 border-1 border-gray-200 rounded-md"
                                                                    >
                                                                        <label className="text-sm text-gray-600">
                                                                            Name
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            value={item.name}
                                                                            onChange={e =>
                                                                                handleOtherLinkChange(
                                                                                    index,
                                                                                    'name',
                                                                                    e.target.value
                                                                                )
                                                                            }
                                                                            className="border p-2 rounded w-full mb-2"
                                                                        />

                                                                        <label className="text-sm text-gray-600">
                                                                            Description
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            value={item.description}
                                                                            onChange={e =>
                                                                                handleOtherLinkChange(
                                                                                    index,
                                                                                    'description',
                                                                                    e.target.value
                                                                                )
                                                                            }
                                                                            className="border p-2 rounded w-full mb-2"
                                                                        />

                                                                        <label className="text-sm text-gray-600">
                                                                            Link
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            value={item.link}
                                                                            onChange={e =>
                                                                                handleOtherLinkChange(
                                                                                    index,
                                                                                    'link',
                                                                                    e.target.value
                                                                                )
                                                                            }
                                                                            className="border p-2 rounded w-full mb-2"
                                                                        />

                                                                        <div className="flex justify-end">
                                                                            <img
                                                                                src="/images/assets/trashcan-icon.svg"
                                                                                alt="Delete"
                                                                                onClick={() => deleteOtherLink(index)}
                                                                                className="cursor-pointer"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <a
                                                                        key={`otherLinks-${index}`}
                                                                        href={item.link}
                                                                        target="_blank"
                                                                        rel="noreferrer"
                                                                        className="flex flex-col gap-1 p-2 border-2 border-gray-200 rounded-md hover:border-gray-400"
                                                                    >
                                                                        <p className="font-semibold">{item.name}</p>
                                                                        <p className="text-sm text-gray-600">
                                                                            {item.description}
                                                                        </p>
                                                                        <p className="break-all text-blue-600 underline">
                                                                            {item.link}
                                                                        </p>
                                                                    </a>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            } else {
                                                // Handle "supplementary" links
                                                const categoryLinks = links[categoryGroup][key.name];
                                                if (!categoryLinks || categoryLinks.length === 0) return null;

                                                return (
                                                    <div
                                                        key={key.name}
                                                        className="flex flex-col gap-3 rounded-[4px] p-5 bg-gray-50 border-1 border-gray-200 w-full hover:bg-gray-100 hover:text-gray"
                                                    >
                                                        <div className="flex justify-between items-center">
                                                            <p className="capitalize">{key.display}</p>
                                                            {editMode && (
                                                                <img
                                                                    src="/images/assets/plus-icon.svg"
                                                                    alt="Add Link"
                                                                    className="cursor-pointer"
                                                                    onClick={() => addNewLink(categoryGroup, key.name)}
                                                                />
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col gap-3">
                                                            {categoryLinks.map((link, index) =>
                                                                editMode ? (
                                                                    <div
                                                                        key={`${key.name}-${index}`}
                                                                        className="flex flex-row gap-2 items-center"
                                                                    >
                                                                        <img
                                                                            src={`/images/assets/${key.name.toLowerCase()}-icon.png`}
                                                                            alt={key.name}
                                                                            className="h-6 w-6"
                                                                        />
                                                                        <input
                                                                            type="text"
                                                                            value={link}
                                                                            onChange={e =>
                                                                                handleLinkChange(
                                                                                    categoryGroup,
                                                                                    key.name,
                                                                                    index,
                                                                                    e.target.value
                                                                                )
                                                                            }
                                                                            className="border-2 border-gray-300 p-2 rounded-md w-full"
                                                                        />
                                                                        <img
                                                                            src="/images/assets/trashcan-icon.svg"
                                                                            alt="Delete"
                                                                            onClick={() =>
                                                                                deleteLink(
                                                                                    categoryGroup,
                                                                                    key.name,
                                                                                    index
                                                                                )
                                                                            }
                                                                            className="cursor-pointer"
                                                                        />
                                                                    </div>
                                                                ) : (
                                                                    <a
                                                                        key={`${key.name}-${index}`}
                                                                        href={link}
                                                                        target="_blank"
                                                                        rel="noreferrer"
                                                                        className="flex flex-row gap-2 items-center hover:text-blue-500"
                                                                    >
                                                                        <img
                                                                            src={`/images/assets/${key.name.toLowerCase()}-icon.png`}
                                                                            alt={key.name}
                                                                            className="h-6 w-6"
                                                                        />
                                                                        <p className="text-bodyMd mmd:text-bodySm break-all">
                                                                            {link}
                                                                        </p>
                                                                    </a>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        })}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <Toast ref={toast} baseZIndex={1000} position="bottom-right" />
        </div>
    );
};

/* -------------------------------------------------------------------------- */
/*                          Utility Functions & Components                    */
/* -------------------------------------------------------------------------- */

// Utility function to check if an array of strings has non-empty values
const isNonEmptyArray = (arr: string[] | undefined) =>
    Array.isArray(arr) && arr.length > 0 && arr.some(link => link.trim() !== '');

// Utility function for otherLinks array
const isNonEmptyOtherLinksArray = (arr: Pub['otherLinks']) =>
    Array.isArray(arr) && arr.length > 0 && arr.some(item => !!item.link);

// Initialize links from supplementary data
const initializeLinks = (supplementary: Pub['supplementary']): LinksState => {
    // Cast to a looser type so TS will allow dynamic indexing
    const sup = supplementary as Record<string, Record<string, string[] | undefined> | undefined>;

    const links: LinksState = {};

    // Loop over your LINK_CATEGORIES
    Object.entries(LINK_CATEGORIES).forEach(([category, subCategories]) => {
        links[category] = {};

        subCategories.forEach(({ name }) => {
            // Use `sup[category]` instead of direct `supplementary[category]`
            links[category][name] = sup[category]?.[name] ?? [];
        });
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
}> = ({ name, authors, journal, date, citations, image, doi }) => (
    <div className="flex flex-col gap-5 pb-10 border-b-2 border-gray-200 mmd:justify-center mmd:items-center">
        <div className="flex justify-between">
            <div className="h-48 w-48 md:h-[120px] md:w-[120px] overflow-hidden border-2 border-gray-200 rounded-lg flex justify-center items-center bg-white">
                <PublicationImage image={image} />
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
