import React, { useContext, useState, useRef } from 'react';
import axios from 'axios';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { NewPub, createDefaultNewPub } from '../interfaces/NewPub';
import { LINK_CATEGORIES } from '../interfaces/Links';
import { AuthContext } from '../hooks/AuthContext';

const SubmitPublication: React.FC = () => {
    const authContext = useContext(AuthContext);

    // State variables for the publication
    const [newPub, setNewPub] = useState<NewPub>(createDefaultNewPub());
    const [links, setLinks] = useState<{ [key: string]: string[] }>(
        initializeLinks({
            github: '',
            codeOcean: '',
            geo: '',
            dbGap: '',
            figshare: '',
            kaggle: '',
            dryad: '',
            empiar: '',
            gigaDb: '',
            dataverse: '',
            IEEE: '',
            mendeley: '',
            openScienceframework: '',
            zenodo: '',
            gitlab: '',
            finngenGitbook: '',
            pdf: '',
            docx: '',
            clinicalTrial: '',
            ega: '',
            zip: '',
            xlsx: '',
            csv: '',
            gtexPortal: '',
            proteinDataBank: '',
            ebiAcUk: '',
            gsea: ''
        })
    );

    // Manage when to show 'Required Field' popup
    const [clickedTitle, setClickedTitle] = useState<boolean>(false);
    const [clickedDoi, setClickedDoi] = useState<boolean>(false);

    // Toast instantiation
    const toast = useRef<Toast>(null);

    const addNewLink = (category: string) => {
        setLinks(prevLinks => ({
            ...prevLinks,
            [category]: [...(prevLinks[category] || []), '']
        }));
    };

    const handleLinkChange = (category: string, index: number, value: string) => {
        setLinks(prevLinks => {
            const updatedLinks = { ...prevLinks };
            updatedLinks[category][index] = value;
            return updatedLinks;
        });
    };

    const deleteLink = (category: string, index: number) => {
        setLinks(prevLinks => {
            const updatedLinks = { ...prevLinks };
            updatedLinks[category] = updatedLinks[category].filter((_, idx) => idx !== index);
            return updatedLinks;
        });
    };

    const submitPublication = async () => {
        const formattedSupplementary = Object.fromEntries(
            Object.entries(links).map(([key, value]) => [key, value.join(', ')])
        );

        try {
            await axios.post('/api/publications/new', {
                ...newPub,
                supplementary: formattedSupplementary,
                submitter: authContext?.user.email
            });
            toast.current?.show({
                severity: 'success',
                summary: 'Successful Publication Submission',
                detail: 'A new publication request has been successfully submitted. Thank you for taking time to contribute to the platform!',
                life: 8000
            });
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Publication Not Submitted',
                detail: 'The publication has not been submitted due to an internal error. Please again later.',
                life: 8000
            });
            console.error('Error submitting new publication:', error);
        }
    };

    return (
        <div className="px-60 py-[85px]">
            <div className="flex flex-row justify-between items-center pb-5">
                <h1 className="w-full text-heading2Xl font-semibold">Submit a Publication</h1>
                <button
                    disabled={newPub.name && newPub.doi ? false : true}
                    className={`flex flex-row justify-center items-center px-5 py-2 ${newPub.name && newPub.doi ? 'bg-blue-1000' : 'bg-gray-400'} bg-blue-1000 text-white shadow-button rounded-md`}
                    onClick={submitPublication}
                >
                    Submit
                </button>
            </div>
            <div className="flex flex-col gap-10 text-black-900">
                <hr />

                <div className="flex items-start self-stretch gap-5">
                    <div className="flex flex-col items-start gap-2">
                        <h2 className="text-headingXl font-semibold">Publication Details</h2>
                        <p className="text-bodyMd">
                            Include all relevant information for your publication. We are only accepting articles that
                            are published after 2017.
                        </p>
                    </div>
                    <div className="flex flex-col gap-4 w-full">
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
                        <div className="flex flex-col gap-1">
                            <p className="text-bodyMd">Journal</p>
                            <InputText
                                className="w-full"
                                onChange={e => setNewPub({ ...newPub, journal: e.target.value })}
                            />
                        </div>
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
                        <div className="flex flex-col gap-1">
                            <p className="text-bodyMd">Authors</p>
                            <InputText
                                className="w-full"
                                onChange={e => setNewPub({ ...newPub, authors: e.target.value })}
                            />
                            <p className="text-bodySm text-gray-700">
                                List co-authors in this format: LastName, FirstName with a semi-colon separating each
                                individual author. Authors tagged here will be able see the data shared in publication
                                on their personal statistics page.
                            </p>
                        </div>
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
                        <div className="flex flex-col gap-1">
                            <p className="text-bodyMd">Publisher</p>
                            <InputText
                                className="w-full"
                                onChange={e => setNewPub({ ...newPub, publisher: e.target.value })}
                            />
                        </div>
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
                <div className="flex flex-col gap-5">
                    {Object.entries(LINK_CATEGORIES).map(([categoryGroup, keys]) => {
                        return (
                            <>
                                <div key={categoryGroup} className="flex flex-row gap-4">
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
                                                        const isExisting = Boolean(links[key.name]?.length); // Check dynamically if the category has links

                                                        return (
                                                            <button
                                                                key={key.name}
                                                                onClick={() => {
                                                                    addNewLink(key.name); // Always call addNewLink, which updates the links state
                                                                }}
                                                                className={`flex flex-row gap-1 justify-center items-center p-3 text-headingMd rounded-full font-medium bg-gray-50 border-gray-200 ${isExisting ? 'text-black-900' : 'text-gray-700'}`}
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
                                                                    `${key.display}`
                                                                )}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Links */}
                                    <div className="flex flex-col gap-3 w-1/2">
                                        <div className="flex flex-col gap-5">
                                            {keys.map(key => {
                                                const categoryLinks = links[key.name];
                                                if (!categoryLinks || categoryLinks.length === 0) return null;

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
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <hr />
                            </>
                        );
                    })}
                </div>
            </div>
            <Toast ref={toast} baseZIndex={1000} position="bottom-right" />
        </div>
    );
};

const capitalizeFirst = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

const initializeLinks = (supplementary: { [key: string]: string | undefined }) => {
    const links: { [key: string]: string[] } = {};
    Object.entries(supplementary || {}).forEach(([key, value]) => {
        links[key] = value ? value.split(',').map(link => link.trim()) : [];
    });
    return links;
};

export default SubmitPublication;
