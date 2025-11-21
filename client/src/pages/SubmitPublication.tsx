import React, { useContext, useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
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
    const [links, setLinks] = useState<NewPub['supplementary']>(createDefaultNewPub().supplementary);

    // State for the "otherLinks" array (objects with name/description/link)
    const [otherLinks, setOtherLinks] = useState<NewPub['otherLinks']>([]);

    // Manage when to show 'Required Field' popup
    const [clickedDoi, setClickedDoi] = useState<boolean>(false);

    // State for sending to director checkbox
    const [sendDirector, setSendDirector] = useState<boolean>(false);

    // Scraping progress
    const [Inprogress, setInprogress] = useState<boolean>(false);

    // State for scientists in db
    const [scientistEmails, setScientistsEmails] = useState<String[]>([]);

    const toast = useRef<Toast>(null);

    useEffect(() => {
        const getScientists = async () => {
            try {
                const res = await axios.get(`/api/authors/all`);
                const emails = res.data.map(scientist => scientist.email.trim());
                setScientistsEmails(emails);
            } catch (error) {
                console.log(error);
            }
        };
        getScientists();
    }, []);

    // For all subcategories that store an array of strings
    const addNewLink = (categoryGroup: string, key: string) => {
        setLinks(prev => ({
            ...prev,
            [categoryGroup]: {
                ...(prev[categoryGroup] || {}),
                [key]: [...(prev[categoryGroup]?.[key] ?? []), '']
            }
        }));
    };

    const handleLinkChange = (categoryGroup: string, key: string, index: number, value: string) => {
        setLinks(prev => {
            const arr = [...(prev[categoryGroup]?.[key] ?? [])];
            arr[index] = value;
            return {
                ...prev,
                [categoryGroup]: {
                    ...(prev[categoryGroup] || {}),
                    [key]: arr
                }
            };
        });
    };

    const deleteLink = (categoryGroup: string, key: string, index: number) => {
        setLinks(prev => {
            const arr = (prev[categoryGroup]?.[key] ?? []).filter((_, i) => i !== index);
            return {
                ...prev,
                [categoryGroup]: {
                    ...(prev[categoryGroup] || {}),
                    [key]: arr
                }
            };
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
        setInprogress(true);

        try {
            // Construct the final object to send
            const updatedPub: NewPub = {
                ...newPub,
                scraped: false,
                fanout: {
                    request: sendDirector,
                    completed: false,
                    verdict: null
                },
                supplementary: links,
                otherLinks,
                submitter: authContext?.user?.email
            };

            const res = await axios.post('/api/publications/new', updatedPub);
            if (typeof res.data === 'string') {
                if (res.data.includes('http')) {
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Successful Publication Submission',
                        detail: (
                            <div className="flex flex-col w-full jusify-center items-center flex-wrap">
                                <p className="text-bodyLg">
                                    Your newly submitted publication can be found in the platform at:
                                </p>
                                <a
                                    href={res.data}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline text-bodyLg"
                                >
                                    {res.data}
                                </a>
                            </div>
                        ),
                        life: 20000
                    });
                    setNewPub(createDefaultNewPub());
                } else if (res.data === 'DOI exists in database already') {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Unexpected error occured.',
                        detail: res.data,
                        life: 20000
                    });
                } else {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Unexpected error occured.',
                        detail: res.data,
                        life: 20000
                    });
                }
            } else {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Unexpected error occured.',
                    detail: res.data,
                    life: 20000
                });
            }
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Publication Not Submitted',
                detail: `The publication has not been submitted due to an internal error. Please try again later. ${error}`,
                life: 20000
            });
            console.error('Error submitting new publication:', error);
        }
        setInprogress(false);
    };

    const fetchPublication = async () => {
        setInprogress(true);
        const updatedPub: NewPub = {
            ...newPub,
            scraped: false,
            fanout: {
                request: sendDirector,
                completed: false,
                verdict: null
            },
            supplementary: links,
            otherLinks,
            submitter: authContext?.user?.email
        };
        try {
            const res = await axios.post(`/api/publications/scrape`, updatedPub);
            if (typeof res.data !== 'string') {
                setNewPub(res.data);
                setLinks(res.data.supplementary);
                console.log(res.data);
            } else {
                if (res.data === 'DOI exists in database already') {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Unexpected error occured.',
                        detail: res.data,
                        life: 20000
                    });
                } else {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Unexpected error occured.',
                        detail: res.data,
                        life: 20000
                    });
                }
            }
        } catch (error) {
            console.log(error);
        }
        setInprogress(false);
    };
    return (
        <div className="px-60 py-[90px] bg-white">
            {/* Header / Submit Button */}
            <div className="flex flex-row justify-between items-center pb-5">
                <div className="flex flex-col gap-1 w-3/5">
                    <h1 className="text-heading2Xl font-semibold text-black-900">Submit a Publication</h1>
                    <p className="text-bodyXs">
                        <span className="text-bodyXs">*</span> Please wait at least 24 hours after a publication has
                        been published before submitting it to the platform so we can ensure our reference databases
                        have been populated
                    </p>
                </div>

                <div className="flex flex-row justify-center items-center gap-2">
                    {scientistEmails.includes(authContext?.user?.email) ? (
                        <div className="flex flex-row justify-center items-center gap-2">
                            <input
                                type="checkbox"
                                checked={sendDirector}
                                onChange={e => setSendDirector(!sendDirector)}
                                className="rounded-sm text-blue-600"
                            />
                            <p className="text-bodySm">Notify director of new publication</p>
                        </div>
                    ) : null}

                    <button
                        disabled={newPub.doi ? false : true}
                        className={`flex flex-row justify-center items-center px-5 py-2 ${
                            newPub.doi ? 'bg-sp_dark_green' : 'bg-gray-400'
                        } text-white shadow-button rounded-md`}
                        onClick={submitPublication}
                    >
                        Submit
                    </button>
                </div>
            </div>

            {Inprogress ? (
                <div className="flex flex-col gap-2 justify-center items-center min-h-screen">
                    <ProgressSpinner
                        style={{ width: '300px', height: '300px' }}
                        strokeWidth="3"
                        fill="var(--surface-ground)"
                        animationDuration="3s"
                    />
                </div>
            ) : (
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
                            {/* DOI */}
                            <div className="flex flex-col gap-1">
                                <p className="text-bodyMd">
                                    DOI <span className="text-red-600"> *</span>
                                </p>
                                <div className="flex flex-row gap-4">
                                    <InputText
                                        value={newPub.doi}
                                        className={`${newPub.doi === '' && clickedDoi ? 'invalid-box' : ''} w-full`}
                                        onChange={e => setNewPub({ ...newPub, doi: e.target.value })}
                                        onClick={() => setClickedDoi(true)}
                                    />
                                    <button
                                        disabled={newPub.doi ? false : true}
                                        className={`flex flex-row justify-center items-center ${
                                            newPub.doi ? 'bg-sp_dark_green' : 'bg-gray-400'
                                        } text-white shadow-button rounded-md min-w-28`}
                                        onClick={() => fetchPublication()}
                                    >
                                        Fetch Data
                                    </button>
                                </div>

                                {newPub.doi === '' && clickedDoi && (
                                    <div className="flex flex-row gap-1">
                                        <img src="/images/assets/required-icon.svg" alt="" />
                                        <p className="text-bodySm text-red-1000">Required Field</p>
                                    </div>
                                )}
                            </div>
                            {sendDirector && (
                                <div className="flex flex-col gap-2">
                                    <p className="text-bodyMd">Publication Summary</p>
                                    <InputTextarea
                                        value={newPub.summary}
                                        className="w-full h-full"
                                        onChange={e => setNewPub({ ...newPub, summary: e.target.value })}
                                        autoResize
                                    />
                                    <p className="text-bodySm text-gray-700">
                                        Give a brief description of the publication for the scientific director's
                                        reference (max: 2 sentences).
                                    </p>
                                </div>
                            )}

                            {/* Title */}
                            {newPub.name && (
                                <div className="flex flex-col gap-1">
                                    <p className="text-bodyMd">Publication Title</p>
                                    <InputText
                                        value={newPub.name}
                                        className="w-full"
                                        onChange={e => setNewPub({ ...newPub, name: e.target.value })}
                                        disabled={true}
                                    />
                                </div>
                            )}

                            {/* Journal */}
                            {newPub.journal && (
                                <div className="flex flex-col gap-1">
                                    <p className="text-bodyMd">Journal</p>
                                    <InputText
                                        value={newPub.journal}
                                        className="w-full"
                                        onChange={e => setNewPub({ ...newPub, journal: e.target.value })}
                                        disabled={true}
                                    />
                                </div>
                            )}

                            {/* Type */}
                            {/* <div className="flex flex-col gap-1">
                                <p className="text-bodyMd">Type</p>
                                <InputText
                                    value={newPub.type}
                                    className="w-full"
                                    onChange={e => setNewPub({ ...newPub, type: e.target.value })}
                                    disabled={true}
                                />
                                <p className="text-bodySm text-gray-700">
                                    Tell us what type of publication this is. An article, review, etc.
                                </p>
                            </div> */}

                            {/* Authors */}
                            {newPub.authors && (
                                <div className="flex flex-col gap-1">
                                    <p className="text-bodyMd">Authors</p>
                                    <InputText
                                        value={newPub.authors}
                                        className="w-full"
                                        onChange={e => setNewPub({ ...newPub, authors: e.target.value })}
                                        disabled={true}
                                    />
                                    {/* <p className="text-bodySm text-gray-700">
                                    List co-authors in this format: LastName, FirstName with a semi-colon separating
                                    each individual author. Authors tagged here will be able to see the data shared in
                                    the publication stats on their personal statistics page.
                                </p> */}
                                </div>
                            )}

                            {/* Affiliations */}
                            {newPub.affiliations.length !== 0 && (
                                <div className="flex flex-col gap-1">
                                    <p className="text-bodyMd">Affiliations</p>
                                    {newPub.affiliations.map((affil, index) => (
                                        <div className="flex flex-row gap-2" key={index}>
                                            <InputText
                                                className="w-full"
                                                value={affil}
                                                onChange={e =>
                                                    setNewPub({
                                                        ...newPub,
                                                        affiliations: newPub.affiliations.toSpliced(
                                                            index,
                                                            1,
                                                            e.target.value
                                                        )
                                                    })
                                                }
                                                disabled={true}
                                            />
                                            {/* <div className="flex justify-end">
                                            <img
                                                src="/images/assets/trashcan-icon.svg"
                                                alt="Delete"
                                                onClick={() =>
                                                    setNewPub({
                                                        ...newPub,
                                                        affiliations: newPub.affiliations.toSpliced(index, 1)
                                                    })
                                                }
                                                className="cursor-pointer"
                                            />
                                        </div> */}
                                        </div>
                                    ))}
                                    {/* <div className="flex justify-between items-center">
                                    <p className="text-bodySm text-gray-700">
                                        List all affiliations in this publication.
                                    </p>
                                    <img
                                        src="/images/assets/plus-icon.svg"
                                        alt="Add Link"
                                        className="cursor-pointer"
                                        onClick={() =>
                                            setNewPub({
                                                ...newPub,
                                                affiliations: newPub.affiliations.toSpliced(
                                                    newPub.affiliations.length,
                                                    0,
                                                    ''
                                                )
                                            })
                                        }
                                    />
                                </div> */}
                                </div>
                            )}

                            {/* Publisher */}
                            {newPub.publisher && (
                                <div className="flex flex-col gap-1">
                                    <p className="text-bodyMd">Publisher</p>
                                    <InputText
                                        value={newPub.publisher}
                                        className="w-full"
                                        onChange={e => setNewPub({ ...newPub, publisher: e.target.value })}
                                        disabled={true}
                                    />
                                </div>
                            )}

                            {/* Publish Date */}
                            {newPub.date && (
                                <div className="flex flex-col gap-1">
                                    <p className="text-bodyMd">Publish Date</p>
                                    <div className="card flex justify-content-center rounded-lg">
                                        <Calendar
                                            value={new Date(newPub.date)}
                                            onChange={e => setNewPub({ ...newPub, date: e.value })}
                                            style={{ borderRadius: '20px' }}
                                            className="rounded-lg"
                                            disabled={true}
                                            dateFormat="yy-mm-dd"
                                        />
                                    </div>
                                </div>
                            )}
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
                                                        const isExisting = Boolean(
                                                            links[categoryGroup]?.[key.name]?.length
                                                        );
                                                        return (
                                                            <button
                                                                key={key.name}
                                                                onClick={() => addNewLink(categoryGroup, key.name)}
                                                                className={`flex flex-row gap-1 justify-center items-center p-3 text-headingMd rounded-full font-medium bg-gray-50 border-gray-200 hover:bg-gray-100 
																${isExisting ? 'text-black-900' : 'text-gray-700'}`}
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
                                                                        className="flex flex-col gap-2 p-3 border-1 border-open_border rounded-md"
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
                                                                            className="border-1 border-open_border p-2 rounded-md w-full"
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
                                                                            className="border-1 border-open_border p-2 rounded-md w-full"
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
                                                                            className="rounded border-1 border-open_border w-full"
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
                                                                            className="border-1 border-open_border p-2 rounded-md w-full"
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
                                                    const categoryLinks = links[categoryGroup]?.[key.name] ?? [];
                                                    if (categoryLinks.length === 0) {
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
                                                                    onClick={() => addNewLink(categoryGroup, key.name)}
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
                                                                            value={link}
                                                                            onChange={e =>
                                                                                handleLinkChange(
                                                                                    categoryGroup,
                                                                                    key.name,
                                                                                    index,
                                                                                    e.target.value
                                                                                )
                                                                            }
                                                                            className="border-1 border-open_border p-2 rounded-md w-full"
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
            )}

            <Toast ref={toast} baseZIndex={1000} position="bottom-right" />
        </div>
    );
};

const capitalizeFirst = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

export default SubmitPublication;
