import React, { useContext, useState, useRef } from 'react';
import axios from 'axios';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { NewPub, createDefaultNewPub } from '../interfaces/NewPub';
import { LINK_CATEGORIES } from '../interfaces/Links';
import { AuthContext } from '../hooks/AuthContext';

interface Option {
    name: String;
}

const options: Option[] = [
    { name: 'Code' },
    { name: 'Data' },
    { name: 'Containers' },
    { name: 'Results' },
    { name: 'Trials' },
    { name: 'Miscellaneous' }
];

const SubmitPublication: React.FC = () => {
    const authContext = useContext(AuthContext);

    // State for the main publication info
    const [newPub, setNewPub] = useState<NewPub>(createDefaultNewPub());

    // State for supplementary resources
    const [links, setLinks] = useState<{ [key: string]: string[] }>(initializeLinks({}));

    // State for the "otherLinks" array (objects with name/description/link)
    const [otherLinks, setOtherLinks] = useState<NewPub['otherLinks']>([]);

    // Manage when to show 'Required Field' popup
    const [clickedTitle, setClickedTitle] = useState<boolean>(false);
    const [clickedDoi, setClickedDoi] = useState<boolean>(false);

    const toast = useRef<Toast>(null);

    // For all subcategories that store an array of strings
    const addNewLink = (category: string) => {
        setLinks(prevLinks => ({
            ...prevLinks,
            [category]: [...(prevLinks[category] || []), '']
        }));
    };

    const handleLinkChange = (category: string, index: number, value: string) => {
        setLinks(prevLinks => {
            const updated = { ...prevLinks };
            updated[category][index] = value;
            return updated;
        });
    };

    const deleteLink = (category: string, index: number) => {
        setLinks(prevLinks => {
            const updated = { ...prevLinks };
            updated[category] = updated[category].filter((_, idx) => idx !== index);
            return updated;
        });
    };

    // Add a new otherLink object
    const addNewOtherLink = () => {
        setOtherLinks(prev => [...prev, { name: '', description: '', recommendedCategory: '', link: '' }]);
    };

    // Update one field otherLink entry
    const handleOtherLinkFieldChange = (
        index: number,
        field: 'name' | 'description' | 'recommendedCategory' | 'link',
        value: string
    ) => {
        setOtherLinks(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    // Delete an otherLink entry
    const deleteOtherLink = (index: number) => {
        setOtherLinks(prev => prev.filter((_, i) => i !== index));
    };

    const submitPublication = async () => {
        // Build the nested supplementary object from `links`:
        const updatedSupplementary = convertLinksToSupplementary(links);

        try {
            // Construct the final object to send
            const updatedPub: NewPub = {
                ...newPub,
                supplementary: updatedSupplementary,
                otherLinks,
                submitter: authContext?.user.email
            };

            await axios.post('/api/publications/new', updatedPub);

            toast.current?.show({
                severity: 'success',
                summary: 'Successful Publication Submission',
                detail: 'A new publication request has been successfully submitted. Thank you for contributing!',
                life: 8000
            });
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Publication Not Submitted',
                detail: 'The publication has not been submitted due to an internal error. Please try again later.',
                life: 8000
            });
            console.error('Error submitting new publication:', error);
        }
    };

    return (
        <div className="px-60 py-[85px]">
            {/* Header / Submit Button */}
            <div className="flex flex-row justify-between items-center pb-5">
                <h1 className="w-full text-heading2Xl font-semibold">Submit a Publication</h1>
                <button
                    disabled={newPub.name && newPub.doi ? false : true}
                    className={`flex flex-row justify-center items-center px-5 py-2 ${
                        newPub.name && newPub.doi ? 'bg-blue-1000' : 'bg-gray-400'
                    } text-white shadow-button rounded-md`}
                    onClick={submitPublication}
                >
                    Submit
                </button>
            </div>

            {/* Publication Form */}
            <div className="flex flex-col gap-10 text-black-900">
                <hr />

                {/* Basic Publication Details */}
                <div className="flex items-start self-stretch gap-5">
                    <div className="flex flex-col items-start gap-2">
                        <h2 className="text-headingXl font-semibold">Publication Details</h2>
                        <p className="text-bodyMd">
                            Include all relevant information for your publication. We are only accepting articles
                            published after 2017.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4 w-full">
                        {/* Title */}
                        <div className="flex flex-col gap-1">
                            <p className="text-bodyMd">
                                Publication Title <span className="text-red-600"> *</span>
                            </p>
                            <InputText
                                className={`${newPub.name === '' && clickedTitle ? 'invalid-box' : ''} w-full`}
                                onChange={e => setNewPub({ ...newPub, name: e.target.value })}
                                onClick={() => setClickedTitle(true)}
                            />
                            {newPub.name === '' && clickedTitle && (
                                <div className="flex flex-row gap-1">
                                    <img src="/images/assets/required-icon.svg" alt="" />
                                    <p className="text-bodySm text-red-1000">Required Field</p>
                                </div>
                            )}
                        </div>

                        {/* DOI */}
                        <div className="flex flex-col gap-1">
                            <p className="text-bodyMd">
                                DOI <span className="text-red-600"> *</span>
                            </p>
                            <InputText
                                className={`${newPub.doi === '' && clickedDoi ? 'invalid-box' : ''} w-full`}
                                onChange={e => setNewPub({ ...newPub, doi: e.target.value })}
                                onClick={() => setClickedDoi(true)}
                            />
                            {newPub.doi === '' && clickedDoi && (
                                <div className="flex flex-row gap-1">
                                    <img src="/images/assets/required-icon.svg" alt="" />
                                    <p className="text-bodySm text-red-1000">Required Field</p>
                                </div>
                            )}
                        </div>

                        {/* Journal */}
                        <div className="flex flex-col gap-1">
                            <p className="text-bodyMd">Journal</p>
                            <InputText
                                className="w-full"
                                onChange={e => setNewPub({ ...newPub, journal: e.target.value })}
                            />
                        </div>

                        {/* Type */}
                        <div className="flex flex-col gap-1">
                            <p className="text-bodyMd">Type</p>
                            <InputText
                                className="w-full"
                                onChange={e => setNewPub({ ...newPub, type: e.target.value })}
                            />
                            <p className="text-bodySm text-gray-700">
                                Tell us what type of publication this is. An article, review, etc.
                            </p>
                        </div>

                        {/* Authors */}
                        <div className="flex flex-col gap-1">
                            <p className="text-bodyMd">Authors</p>
                            <InputText
                                className="w-full"
                                onChange={e => setNewPub({ ...newPub, authors: e.target.value })}
                            />
                            <p className="text-bodySm text-gray-700">
                                List co-authors in this format: LastName, FirstName with a semi-colon separating each
                                individual author. Authors tagged here will be able to see the data shared in
                                publication on their personal statistics page.
                            </p>
                        </div>

                        {/* Affiliations */}
                        <div className="flex flex-col gap-1">
                            <p className="text-bodyMd">Affiliations</p>
                            <InputText
                                className="w-full"
                                onChange={e => setNewPub({ ...newPub, affiliations: e.target.value })}
                            />
                            <p className="text-bodySm text-gray-700">
                                List all affiliations made with this publication, no matter how small.
                            </p>
                        </div>

                        {/* Publisher */}
                        <div className="flex flex-col gap-1">
                            <p className="text-bodyMd">Publisher</p>
                            <InputText
                                className="w-full"
                                onChange={e => setNewPub({ ...newPub, publisher: e.target.value })}
                            />
                        </div>

                        {/* Publish Date */}
                        <div className="flex flex-col gap-1">
                            <p className="text-bodyMd">Publish Date</p>
                            <div className="card flex justify-content-center rounded-lg">
                                <Calendar
                                    value={newPub.date}
                                    onChange={e => setNewPub({ ...newPub, date: e.value })}
                                    style={{ borderRadius: '20px' }}
                                    className="rounded-lg"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <hr />

                {/* Link categories (code, data, containers, etc.) */}
                <div className="flex flex-col gap-5">
                    {Object.entries(LINK_CATEGORIES).map(([categoryGroup, keys]) => (
                        <React.Fragment key={categoryGroup}>
                            <div className="flex flex-row gap-4">
                                {/* Left half: instructions & "Add Link" pills */}
                                <div className="flex flex-col gap-2 w-1/2">
                                    <h1 className="text-headingXl text-black-900 font-semibold">
                                        {capitalizeFirst(categoryGroup)}
                                    </h1>
                                    <p className="text-headingSm font-medium text-gray-700">
                                        Add all relevant resource types
                                    </p>

                                    <div className="flex flex-col gap-5">
                                        {/* Pills for adding new links */}
                                        <div className="flex flex-col gap-4">
                                            <div className="flex flex-row flex-wrap gap-2">
                                                {keys.map(key => {
                                                    if (key.name === 'otherLinks') {
                                                        const hasOtherLinks = otherLinks.length > 0;
                                                        return (
                                                            <button
                                                                key={key.name}
                                                                onClick={addNewOtherLink}
                                                                className={`flex flex-row gap-1 justify-center items-center p-3 text-headingMd 
																			rounded-full font-medium bg-gray-50 border-gray-200 
																			${hasOtherLinks ? 'text-black-900' : 'text-gray-700'}`}
                                                            >
                                                                {hasOtherLinks ? (
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
                                                    }

                                                    // Otherwise, it's a normal subcategory
                                                    const isExisting = Boolean(links[key.name]?.length);
                                                    return (
                                                        <button
                                                            key={key.name}
                                                            onClick={() => addNewLink(key.name)}
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
                                    </div>
                                </div>

                                {/* Right half: show input fields for each subcategory that has links */}
                                <div className="flex flex-col gap-3 w-1/2">
                                    <div className="flex flex-col gap-5">
                                        {keys.map(key => {
                                            if (key.name === 'otherLinks') {
                                                if (otherLinks.length < 1) {
                                                    return null;
                                                }
                                                return (
                                                    <div
                                                        key={key.name}
                                                        className="flex flex-col gap-3 rounded-[4px] p-5 bg-gray-50 border-1 border-gray-200 w-full hover:bg-gray-100 hover:text-gray"
                                                    >
                                                        <div className="flex justify-between items-center">
                                                            <p className="capitalize">{key.display}</p>
                                                            <img
                                                                src="/images/assets/plus-icon.svg"
                                                                alt="Add Link"
                                                                className="cursor-pointer"
                                                                onClick={addNewOtherLink}
                                                            />
                                                        </div>

                                                        <div className="flex flex-col gap-3">
                                                            {otherLinks.map((item, index) => (
                                                                <div
                                                                    key={`otherLinks-${index}`}
                                                                    className="flex flex-col gap-2 p-3 border-1 border-gray-200 rounded-md"
                                                                >
                                                                    <label className="text-sm text-gray-600">
                                                                        Name
                                                                    </label>
                                                                    <input
                                                                        value={item.name}
                                                                        onChange={e =>
                                                                            handleOtherLinkFieldChange(
                                                                                index,
                                                                                'name',
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                        className="border-2 border-gray-300 p-2 rounded-md w-full"
                                                                    />

                                                                    <label className="text-sm text-gray-600">
                                                                        Description
                                                                    </label>
                                                                    <input
                                                                        value={item.description}
                                                                        onChange={e =>
                                                                            handleOtherLinkFieldChange(
                                                                                index,
                                                                                'description',
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                        className="border-2 border-gray-300 p-2 rounded-md w-full"
                                                                    />

                                                                    <label className="text-sm text-gray-600">
                                                                        Recommended Category
                                                                    </label>
                                                                    <Dropdown
                                                                        value={item.recommendedCategory}
                                                                        options={options}
                                                                        onChange={e =>
                                                                            handleOtherLinkFieldChange(
                                                                                index,
                                                                                'recommendedCategory',
                                                                                e.value
                                                                            )
                                                                        }
                                                                        optionLabel="name"
                                                                        optionValue="name"
                                                                        placeholder="Select/Type recommended category"
                                                                        editable
                                                                        className="rounded border-2 border-gray-300 border-gray-200 w-full"
                                                                    />

                                                                    <label className="text-sm text-gray-600">
                                                                        Link
                                                                    </label>
                                                                    <input
                                                                        value={item.link}
                                                                        onChange={e =>
                                                                            handleOtherLinkFieldChange(
                                                                                index,
                                                                                'link',
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                        className="border-2 border-gray-300 p-2 rounded-md w-full"
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
                                                            ))}
                                                        </div>
                                                    </div>
                                                );
                                            } else {
                                                // For normal subcategories
                                                const categoryLinks = links[key.name];
                                                if (!categoryLinks || categoryLinks.length === 0) {
                                                    return null;
                                                }
                                                return (
                                                    <div
                                                        key={key.name}
                                                        className="flex flex-col gap-3 rounded-[4px] p-5 bg-gray-50 border-1 border-gray-200 w-full hover:bg-gray-100 hover:text-gray"
                                                    >
                                                        <div className="flex justify-between items-center">
                                                            <p className="capitalize">{key.display}</p>
                                                            <img
                                                                src="/images/assets/plus-icon.svg"
                                                                alt="Add Link"
                                                                className="cursor-pointer"
                                                                onClick={() => addNewLink(key.name)}
                                                            />
                                                        </div>
                                                        <div className="flex flex-col gap-3">
                                                            {categoryLinks.map((link, index) => (
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
                                                                        onClick={() => deleteLink(key.name, index)}
                                                                        className="cursor-pointer"
                                                                    />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        })}
                                    </div>
                                </div>
                            </div>
                            <hr />
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <Toast ref={toast} baseZIndex={1000} position="bottom-right" />
        </div>
    );
};

/**
 * Convert the flat dictionary of arrays (key => string[]) into the nested
 * structure required by `newPub.supplementary`.
 */
function convertLinksToSupplementary(links: { [key: string]: string[] }) {
    return {
        code: {
            github: links['github'] ?? [],
            gitlab: links['gitlab'] ?? []
        },
        data: {
            geo: links['geo'] ?? [],
            dbGap: links['dbGap'] ?? [],
            kaggle: links['kaggle'] ?? [],
            dryad: links['dryad'] ?? [],
            empiar: links['empiar'] ?? [],
            gigaDb: links['gigaDb'] ?? [],
            zenodo: links['zenodo'] ?? [],
            ega: links['ega'] ?? [],
            xlsx: links['xlsx'] ?? [],
            csv: links['csv'] ?? [],
            proteinDataBank: links['proteinDataBank'] ?? [],
            dataverse: links['dataverse'] ?? [],
            openScienceFramework: links['openScienceFramework'] ?? [],
            finngenGitbook: links['finngenGitbook'] ?? [],
            gtexPortal: links['gtexPortal'] ?? [],
            ebiAcUk: links['ebiAcUk'] ?? [],
            mendeley: links['mendeley'] ?? [],
            R: links['R'] ?? []
        },
        containers: {
            codeOcean: links['codeOcean'] ?? [],
            colab: links['colab'] ?? []
        },
        results: {
            gsea: links['gsea'] ?? [],
            figshare: links['figshare'] ?? []
        },
        trials: {
            clinicalTrial: links['clinicalTrial'] ?? []
        },
        packages: {
            bioconductor: links['bioconductor'] ?? [],
            pypi: links['pypi'] ?? [],
            CRAN: links['CRAN'] ?? []
        },
        miscellaneous: {
            IEEE: links['IEEE'] ?? [],
            pdf: links['pdf'] ?? [],
            docx: links['docx'] ?? [],
            zip: links['zip'] ?? []
        }
    };
}

const initializeLinks = (supplementary: { [key: string]: string[] }) => {
    const links: { [key: string]: string[] } = {};
    Object.values(LINK_CATEGORIES).forEach(subCategories => {
        subCategories.forEach(({ name }) => {
            links[name] = supplementary[name] ?? [];
        });
    });
    return links;
};

const capitalizeFirst = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

export default SubmitPublication;
