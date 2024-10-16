import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Tooltip } from 'primereact/tooltip';
import { Dialog } from 'primereact/dialog';
import { CardView } from '../components/CardView/CardView';
import { ListView } from '../components/ListView/ListView';
import { Sidebar } from 'primereact/sidebar';
import { ProgressSpinner } from 'primereact/progressspinner';
import Pub from '../interfaces/Pub';
import BlankPub from '../interfaces/BlankPub';
import NewPublicationModal from '../components/NewPublicationModal/NewPublicationModal';

interface Option {
    name: string;
}

interface Status {
    name: string;
}

interface Lab {
    name: string;
}

interface Author {
    firstName: string;
    lastName: string;
    email: string;
    primaryAppointment: string;
    primaryResearchInstitute: string;
    secondaryAppointment: string | null;
    secondaryResearchInstitute: string | null;
    enid: string;
}

interface stats {
    publications: number;
    citations: number;
}

const options: Option[] = [
    { name: 'A-Z' },
    { name: 'Z-A' },
    { name: 'Most Recent' },
    { name: 'Least Recent' },
    { name: 'Most Citations' },
    { name: 'Least Citations' }
];

const status: Status[] = [{ name: 'Published' }, { name: 'Preprint' }];

const Home: React.FC = () => {
    // State of various dropdowns
    const [sort, setSort] = useState<Option | null>(null);
    const [statusFilter, setStatusFilter] = useState<Status | null>(null);
    const [selectedAuthor, setSelectedAuthor] = useState<Lab | null>(null);

    // State for cardview/listview
    const [cardView, setCardView] = useState<true | false>(true);

    // State for filter sidebar visibility
    const [visible, setVisible] = useState<boolean>(false);

    // State to store fetched data
    const [publications, setPublications] = useState<Pub[] | null>(null);

    // State of search bar
    const [search, setSearch] = useState<string>('');

    // State of loaded content
    const [loaded, setLoaded] = useState<boolean>(false);

    // State of load more button total
    const [totalPubs, setTotalPubs] = useState<number>(20);

    // State of new authors
    const [authors, setAuthors] = useState<Lab[]>([]);

    // Lab Stats
    const [labStats, setLabStats] = useState<stats>({
        publications: 0,
        citations: 0
    });

    // State of new publication modal
    const [newPublicationVisible, setNewPublicationVisible] = useState(false);
    const [newPub, setNewPub] = useState<BlankPub>({
        doi: '',
        name: '',
        journal: '',
        type: 'Journal Article',
        authors: '',
        filteredAuthors: '',
        affiliations: '',
        citations: 0,
        status: 'Published',
        publisher: '',
        supplementary: {
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
        }
    });

    // Fetch publications and stats on load and when filters change
    useEffect(() => {
        setLoaded(false);
        const getPublications = async () => {
            setTotalPubs(20); // Reset total pubs on filter change
            try {
                const res = await axios.post(
                    `/api/publications/select`,
                    {
                        total: totalPubs,
                        sort: sort?.name,
                        lab: selectedAuthor?.name,
                        name: search
                    },
                    {
                        maxBodyLength: Infinity
                    }
                );
                setPublications([...res.data]);
            } catch (error) {
                console.log(error);
            }
        };

        // Retrieve lab stats if selected
        const getStats = async () => {
            if (selectedAuthor) {
                try {
                    const res = await axios.post('/api/stats/lab', {
                        lab: selectedAuthor?.name
                    });
                    setLabStats(res.data);
                } catch (error) {
                    console.log(error);
                }
            } else {
                setLabStats({
                    publications: 0,
                    citations: 0
                });
            }
        };

        getPublications();
        getStats();
        setTimeout(() => setLoaded(true), 1000);
    }, [search, selectedAuthor, sort]);

    // Fetch additional publications from current query when more are requested
    useEffect(() => {
        const getPublications = async () => {
            try {
                const res = await axios.post(
                    `/api/publications/select`,
                    {
                        total: totalPubs,
                        sort: sort?.name,
                        lab: selectedAuthor?.name,
                        name: search
                    },
                    {
                        maxBodyLength: Infinity
                    }
                );
                setPublications([...res.data]);
            } catch (error) {
                console.log(error);
            }
        };
        getPublications();
    }, [totalPubs]);

    // Fetch authors on load
    useEffect(() => {
        const getAuthors = async () => {
            try {
                const res = await axios.get(`/api/authors/all`);
                setAuthors(
                    res.data.map((aut: Author) => ({
                        name: `${aut.lastName}, ${aut.firstName}`
                    }))
                );
            } catch (error) {
                console.log(error);
            }
        };
        getAuthors();
    }, []);

    const handleNewPublicationSubmit = async (formattedPub: BlankPub) => {
        try {
            await axios.post('/api/publications/new', formattedPub);
            setNewPublicationVisible(false);
            setNewPub({
                doi: '',
                name: '',
                journal: '',
                type: 'Journal Article',
                authors: '',
                filteredAuthors: '',
                affiliations: '',
                citations: 0,
                status: 'Published',
                publisher: '',
                supplementary: {}
            });
        } catch (error) {
            console.error('Error submitting new publication:', error);
        }
    };

    return (
        <>
            <div
                id="search-bar"
                className={`transform ${visible ? 'pl-[382px] md:pl-[342px]' : ''} duration-300 ease-in-out fixed top-16 w-full shadow-sm px-16 md:px-1 py-3 flex flex-row gap-4 bg-white z-10`}
            >
                {visible ? (
                    <button
                        onClick={() => setVisible(!visible)}
                        className="min-h-10 min-w-10 hover:bg-gray-100 flex items-center justify-center"
                    >
                        <img src="/images/assets/close-filter-icon.svg" alt="close filter button" />
                    </button>
                ) : (
                    <button
                        onClick={() => setVisible(!visible)}
                        className="min-h-10 min-w-10 hover:bg-gray-100 flex items-center justify-center"
                    >
                        <img src="/images/assets/filter-button-icon.svg" alt="open filter button" />
                    </button>
                )}
                <div className={`flex items-center w-full relative ${visible ? 'mmd:invisible' : ''}`}>
                    <button className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <img src="/images/assets/search-icon.svg" alt="search-icon" className="h-6 w-6" />
                    </button>
                    <InputText
                        placeholder="Search publications"
                        className="pl-12 pr-3 py-2 rounded border-1 border-gray-300 w-full"
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <Dropdown
                    value={sort}
                    onChange={e => {
                        setSort(e.value);
                    }}
                    options={options}
                    optionLabel="name"
                    placeholder="Sort by"
                    showClear
                    className={`rounded border-1 border-gray-300 w-72 md:w-40 text-black-900 ${visible ? 'mmd:invisible' : ''}`}
                />
            </div>
            <div className={`transform ${visible ? 'ml-[320px]' : 'ml-0'} duration-300 ease-in-out`}>
                <Sidebar
                    visible={visible}
                    position="left"
                    onHide={() => setVisible(false)}
                    className={`z-20 w-[320px] mt-[130px] bg-white shadow-sm border-r-1 border-gray-200 custom-sidebar p-sidebar-header`}
                    modal={false}
                    showCloseIcon={false}
                >
                    <div className="p-5 flex flex-col gap-8">
                        <h2 className="text-headingLg text-black-900 font-semibold">Filters</h2>
                        <div className="flex flex-col gap-2">
                            <h3 className="text-headingMd text-black-900 font-semibold">Lab</h3>
                            {authors && (
                                <Dropdown
                                    value={selectedAuthor}
                                    options={authors}
                                    optionLabel="name"
                                    placeholder="Select a lab"
                                    className="rounded border-1 border-gray-300 w-64 text-black-900"
                                    onChange={e => {
                                        e.originalEvent?.stopPropagation();
                                        setSelectedAuthor(e.value);
                                    }}
                                    filter
                                    showClear
                                    filterBy="name"
                                />
                            )}
                        </div>
                        <div className="flex flex-row gap-5 justify-between align-middle text-center">
                            <div className="flex flex-col gap-2 w-[130px]">
                                <h2 className="text-heading2Xl font-semibold text-black-900">
                                    {labStats.publications}
                                </h2>
                                <h3 className="text-bodyMd text-black-900">Publications</h3>
                            </div>
                            <div className="flex flex-col gap-2 w-[130px]">
                                <h2 className="text-heading2Xl font-semibold text-black-900">{labStats.citations}</h2>
                                <h3 className="text-bodyMd text-black-900">Citations</h3>
                            </div>
                        </div>
                    </div>
                </Sidebar>
                <div
                    className={`w-full pt-32 px-16 md:px-6 flex flex-col justify-center gap-5 ${visible ? 'mmd:hidden' : ''}`}
                >
                    <div id="main" className="py-5 w-full">
                        <div className="flex flex-row justify-between items-center w-full">
                            <span className="">Showing {publications?.length} publications</span>
                            {cardView ? (
                                <div className="flex flex-row gap-2 justify-center items-center">
                                    <Tooltip target=".new-pub" />
                                    <img
                                        src="/images/assets/plus-icon.svg"
                                        className="cursor-pointer new-pub hover:bg-gray-200 p-2 rounded-md"
                                        data-pr-tooltip="Request a new entry"
                                        data-pr-position="left"
                                        style={{ fontSize: '2.0rem' }}
                                        onClick={() => setNewPublicationVisible(true)}
                                        alt="create new publication"
                                    />
                                    <button onClick={() => setCardView(true)} className="hover:bg-gray-200">
                                        <img src="/images/assets/card-view-active-icon.svg" alt="card-view-active" />
                                    </button>
                                    <button onClick={() => setCardView(false)} className="hover:bg-gray-200">
                                        <img src="/images/assets/list-view-icon.svg" alt="list-view" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-row gap-2 justify-center items-center">
                                    <Tooltip target=".new-pub" />
                                    <img
                                        src="/images/assets/plus-icon.svg"
                                        className="cursor-pointer new-pub hover:bg-gray-200 p-3 p"
                                        data-pr-tooltip="Request a new entry"
                                        data-pr-position="left"
                                        style={{ fontSize: '2.0rem' }}
                                        onClick={() => setNewPublicationVisible(true)}
                                        alt="create new publication"
                                    />
                                    <button onClick={() => setCardView(true)} className="hover:bg-gray-200">
                                        <img src="/images/assets/card-view-icon.svg" alt="card-view" />
                                    </button>
                                    <button onClick={() => setCardView(false)} className="hover:bg-gray-200">
                                        <img src="/images/assets/list-view-active-icon.svg" alt="list-view-active" />
                                    </button>
                                </div>
                            )}
                        </div>
                        <Dialog
                            visible={newPublicationVisible}
                            header="Create New Publication"
                            onHide={() => setNewPublicationVisible(false)}
                            style={{ width: '800px' }}
                        >
                            <NewPublicationModal
                                pub={newPub}
                                setPub={setNewPub}
                                handleSubmit={handleNewPublicationSubmit}
                            />
                        </Dialog>
                    </div>
                    {loaded && publications ? (
                        cardView ? (
                            <>
                                <CardView
                                    pubs={publications.filter(publication => {
                                        if (search.toLowerCase() === '') return publication;
                                        else if (publication.name.toLowerCase().includes(search.toLowerCase()))
                                            return publication;
                                    })}
                                />

                                {totalPubs <= publications?.length + 20 && (
                                    <button
                                        className="m-auto w-32 h-10 text-BodyMd font-bold mb-10 text-black-900"
                                        onClick={() => setTotalPubs(totalPubs + 40)}
                                    >
                                        Load More
                                    </button>
                                )}
                            </>
                        ) : (
                            <>
                                <ListView
                                    pubs={publications.filter(publication => {
                                        if (search.toLowerCase() === '') return publication;
                                        else if (publication.name.toLowerCase().includes(search.toLowerCase()))
                                            return publication;
                                    })}
                                />
                                {totalPubs <= publications?.length + 20 && (
                                    <button
                                        className="m-auto w-32 h-10 text-BodyMd font-bold mb-10 text-black-900"
                                        onClick={() => setTotalPubs(totalPubs + 40)}
                                    >
                                        Load More
                                    </button>
                                )}
                            </>
                        )
                    ) : (
                        <div className="flex justify-content-center items-center">
                            <ProgressSpinner
                                style={{ width: '200px', height: '200px' }}
                                strokeWidth="4"
                                fill="var(--surface-ground)"
                                animationDuration="1s"
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Home;
