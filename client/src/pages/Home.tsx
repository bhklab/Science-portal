import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { Tooltip } from 'primereact/tooltip';
import { CardView } from '../components/CardView/CardView';
import { ListView } from '../components/ListView/ListView';
import { Sidebar } from 'primereact/sidebar';
import { ProgressSpinner } from 'primereact/progressspinner';
import Pub from '../interfaces/Pub';
import Author from '../interfaces/Author';
import Lab from '../interfaces/Lab';
import { AuthContext } from '../hooks/AuthContext';

interface Option {
    name: string;
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

const resourceTypes: Option[] = [
    { name: 'Code' },
    { name: 'Data' },
    { name: 'Containers' },
    { name: 'Results' },
    { name: 'Trials' },
    { name: 'Protocols' },
    { name: 'Packages' },
    { name: 'Miscellaneous' }
];

const Home: React.FC = () => {
    // State of various dropdowns
    const [sort, setSort] = useState<Option | null>(null);
    const [selectedAuthor, setSelectedAuthor] = useState<Lab | null>(null);
    const [selectedResources, setSelectedResources] = useState<Option[] | null>([]);

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
    const [totalPubs, setTotalPubs] = useState<number>(10);

    // State of new authors
    const [authors, setAuthors] = useState<Lab[]>([]);

    // Lab Stats
    const [labStats, setLabStats] = useState<stats>({
        publications: 0,
        citations: 0
    });

    const authContext = useContext(AuthContext);

    // Fetch publications and stats on load and when filters change
    useEffect(() => {
        setLoaded(false);
        const getPublications = async () => {
            setTotalPubs(10); // Reset total pubs on filter change
            try {
                const res = await axios.post(
                    `/api/publications/select`,
                    {
                        total: totalPubs,
                        sort: sort?.name,
                        lab: selectedAuthor?.name,
                        resources: selectedResources?.map(resource => resource.name.toLowerCase()),
                        search: search,
                        email: authContext?.user?.email
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
    }, [selectedAuthor, selectedResources, sort]);

    // Fetch additional publications from current query when more are requested
    useEffect(() => {
        const getPublications = async () => {
            try {
                const res = await axios.post(`/api/publications/select`, {
                    total: totalPubs,
                    sort: sort?.name,
                    lab: selectedAuthor?.name,
                    resources: selectedResources?.map(resource => resource.name.toLowerCase()),
                    search: search
                });
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

    const submitSearch = async () => {
        setLoaded(false);
        const getPublications = async () => {
            setTotalPubs(10); // Reset total pubs on filter change
            try {
                const res = await axios.post(
                    `/api/publications/select`,
                    {
                        total: totalPubs,
                        sort: sort?.name,
                        lab: selectedAuthor?.name,
                        resources: selectedResources?.map(resource => resource.name.toLowerCase()),
                        search: search,
                        email: authContext?.user?.email
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
    };

    return (
        <>
            <Tooltip target=".resource-type" className="max-w-64" />
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
                    <button
                        className="absolute left-3 top-1/2 transform -translate-y-1/2"
                        onClick={() => submitSearch()}
                    >
                        <img src="/images/assets/search-icon.svg" alt="search-icon" className="h-6 w-6" />
                    </button>
                    <input
                        placeholder={`Search for publications (Ex. Chip seq, or \"author1\" + \"author2\")`}
                        className="pl-12 pr-3 py-2 rounded border-1 border-gray-300 w-full"
                        onChange={e => setSearch(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === 'Enter') {
                                submitSearch();
                            }
                        }}
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
            <div
                className={`transform ${visible ? 'ml-[320px]' : 'ml-0'} duration-300 ease-in-out ${!loaded ? '!mb-32' : ''}`}
            >
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
                            <h3 className="text-headingMd text-black-900 font-semibold">Member</h3>
                            {authors && (
                                <Dropdown
                                    value={selectedAuthor}
                                    options={authors}
                                    optionLabel="name"
                                    placeholder="Select a member"
                                    className="rounded border-1 border-gray-300 w-64 text-black-900"
                                    onChange={e => {
                                        e.originalEvent?.stopPropagation();
                                        if (!selectedAuthor && !sort) {
                                            setSort({ name: 'Most Recent' });
                                        }
                                        setSelectedAuthor(e.value);
                                    }}
                                    onClick={e => e?.stopPropagation()}
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
                        <div className="flex flex-col gap-2">
                            <h3 className="text-headingMd text-black-900 font-semibold">Supplementary Resources</h3>
                            <MultiSelect
                                value={selectedResources}
                                onChange={e => {
                                    e.originalEvent?.stopPropagation();
                                    setSelectedResources(e.value);
                                }}
                                options={resourceTypes}
                                optionLabel="name"
                                placeholder="Select a resource type"
                                id="resource-type"
                                className="rounded border-1 border-gray-300 w-64 text-black-900"
                                panelHeaderTemplate={() => null}
                                tooltip="Filtering publications containing one or more of the selected supplementary resources"
                                data-pr-tooltip="Filtering publications containing one or more of the selected supplementary resource types"
                                data-pr-at="left top-25"
                            />
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
                                    <button onClick={() => setCardView(true)} className="hover:bg-gray-200">
                                        <img src="/images/assets/card-view-active-icon.svg" alt="card-view-active" />
                                    </button>
                                    <button onClick={() => setCardView(false)} className="hover:bg-gray-200">
                                        <img src="/images/assets/list-view-icon.svg" alt="list-view" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-row gap-2 justify-center items-center">
                                    <button onClick={() => setCardView(true)} className="hover:bg-gray-200">
                                        <img src="/images/assets/card-view-icon.svg" alt="card-view" />
                                    </button>
                                    <button onClick={() => setCardView(false)} className="hover:bg-gray-200">
                                        <img src="/images/assets/list-view-active-icon.svg" alt="list-view-active" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    {loaded && publications ? (
                        cardView ? (
                            <>
                                <CardView pubs={publications} />
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
                                <ListView pubs={publications} />
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
                        <div className="flex flex-col justify-center items-center">
                            <ProgressSpinner
                                style={{ width: '250px', height: '250px' }}
                                strokeWidth="3"
                                fill="var(--surface-ground)"
                                animationDuration="1.5s"
                            />
                        </div>
                    )}
                    <div
                        className={`flex flex-row flex-wrap justify-center items-center gap-6 mmd:gap-2 mb-1 ${!loaded ? 'hidden' : ''}`}
                    >
                        <img src="/images/team-logos/pmcc.png" alt="pmcc logo" className="max-w-44" />
                        <img
                            src="/images/team-logos/research-analytics.png"
                            alt="research analytics logo"
                            className="max-w-40"
                        />
                        <img src="/images/team-logos/cdi.svg" alt="cdi logo" className="max-w-36" />

                        <img src="/images/team-logos/bhk.png" alt="bhk lab logo" className="max-w-32" />
                        <img src="/images/team-logos/lupien.png" alt="lupien logo" className="max-w-40" />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
