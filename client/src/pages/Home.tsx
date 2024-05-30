import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { CardView } from '../components/CardView/CardView';
import { ListView } from '../components/ListView/ListView';
import { Sidebar } from 'primereact/sidebar';

interface Option {
    name: string;
}

interface Filter {
    name: string;
}

interface Status {
    name: string;
}

const options: Option[] = [
    { name: 'A-Z' },
    { name: 'Z-A' },
    { name: 'Most Recent' },
    { name: 'Least Recent' },
    { name: 'Most Citations' },
    { name: 'Least Citations' }
];

const filters: Filter[] = [
    { name: 'Any' },
    { name: 'Benjamin Haibe-Kains' },
    { name: 'Lupien' },
    { name: 'Cescon' },
    { name: 'Schimmer' },
    { name: 'Notta' }
];

const status: Status[] = [{ name: 'Published' }, { name: 'Preprint' }];

const Home: React.FC = () => {
    // Drop down states
    const [sort, setSort] = useState<Option | null>(null);
    const [labFilter, setLabFilter] = useState<Filter | null>(null);
    const [statusFilter, setStatusFilter] = useState<Status | null>(null);

    // State for cardview/listview
    const [cardView, setCardView] = useState<true | false>(true);

    // State for filter sidebar visibility
    const [visible, setVisible] = useState<boolean>(false);

    // State to store fetched data
    const [publications, setPublications] = useState<any>([]);

    // Fetch publications on load
    useEffect(() => {
        const getPublications = async () => {
            try {
                const res = await axios.get(`/api/publications/all`);
                setPublications(res.data);
            } catch (error) {
                console.log(error);
            }
        };
        getPublications();
    }, []);

    const publicationSort = (sortMethod: string) => {
        let sortedPublications = [...publications];
        console.log(sortMethod);
        if (sortMethod === 'A-Z') {
            sortedPublications.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortMethod === 'Z-A') {
            sortedPublications.sort((a, b) => b.name.localeCompare(a.name));
        } else if (sortMethod === 'Most Recent') {
            sortedPublications.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        } else if (sortMethod === 'Least Recent') {
            sortedPublications.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        } else if (sortMethod === 'Most Citations') {
            sortedPublications.sort((a, b) => b.citations - a.citations);
        } else if (sortMethod === 'Least Citations') {
            sortedPublications.sort((a, b) => a.citations - b.citations);
        }

        setPublications(sortedPublications);
    };

    return (
        <>
            <div
                id="search-bar"
                className={`transform ${visible ? 'pl-[382px] md:pl-[342px]' : ''} duration-300 ease-in-out fixed top-16 w-full shadow-sm px-16 md:px-1 py-3 flex flex-row gap-4 bg-white z-10`}
            >
                {visible ? (
                    <button onClick={() => setVisible(!visible)} className="min-h-10 min-w-10">
                        <img src="/images/assets/close-filter-icon.svg" alt="close filter button" />
                    </button>
                ) : (
                    <button onClick={() => setVisible(!visible)} className="min-h-10 min-w-10">
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
                    />
                </div>
                <Dropdown
                    value={sort}
                    onChange={e => {
                        publicationSort(e.value.name);
                        setSort(e.value);
                    }}
                    options={options}
                    optionLabel="name"
                    placeholder="Sort by"
                    className={`rounded border-1 border-gray-300 w-72 md:w-40 text-black-900 ${visible ? 'mmd:invisible' : ''}`}
                />
            </div>
            <div className={`transform ${visible ? 'ml-[320px]' : 'ml-0'} duration-300 ease-in-out`}>
                <Sidebar
                    visible={visible}
                    position="left"
                    onHide={() => {}}
                    className={`z-20 w-[320px] mt-[130px] bg-white shadow-sm border-r-1 border-gray-200 custom-sidebar p-sidebar-header`}
                    modal={false}
                    showCloseIcon={false}
                >
                    <div className="p-5 flex flex-col gap-8">
                        <h2 className="text-headingLg text-black-900 font-semibold">Filters</h2>
                        <div className="flex flex-col gap-2">
                            <h3 className="text-headingMd text-black-900 font-semibold">Lab</h3>
                            <Dropdown
                                value={labFilter}
                                options={filters}
                                optionLabel="name"
                                placeholder="Select a lab"
                                className="rounded border-1 border-gray-300 w-64 text-black-900"
                                onChange={e => {
                                    e.originalEvent?.stopPropagation(); // Prevent click event from propagating
                                    setLabFilter(e.target.value);
                                }}
                            />
                        </div>
                        <div className="flex flex-row gap-5 justify-between align-middle text-center">
                            <div className="flex flex-col gap-2 w-[130px]">
                                <h2 className="text-heading2Xl font-semibold text-gray-700">50</h2>
                                <h3 className="text-bodyMd text-black-900">Publications</h3>
                            </div>
                            <div className="flex flex-col gap-2 w-[130px]">
                                <h2 className="text-heading2Xl font-semibold text-gray-700">320</h2>
                                <h3 className="text-bodyMd text-black-900">Citations</h3>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <h3 className="text-headingMd text-black-900 font-semibold">Publication Status</h3>
                            <Dropdown
                                value={statusFilter}
                                options={status}
                                optionLabel="name"
                                placeholder="Select a status"
                                className="rounded border-1 border-gray-300 w-64 text-black-900"
                                onChange={e => {
                                    e.originalEvent?.stopPropagation(); // Prevent click event from propagating
                                    setStatusFilter(e.target.value);
                                }}
                            />
                        </div>
                    </div>
                </Sidebar>
                <div
                    className={`w-full pt-32 px-16 md:px-6 flex flex-col justify-center gap-5 ${visible ? 'mmd:hidden' : ''}`}
                >
                    <div id="main" className="py-5 w-full">
                        <div className="flex flex-row justify-between items-center w-full">
                            <span className="">6 of 120 publications</span>
                            {cardView ? (
                                <div className="flex flex-row gap-2">
                                    <button onClick={() => setCardView(true)}>
                                        <img src="/images/assets/card-view-active-icon.svg" alt="card-view-active" />
                                    </button>
                                    <button onClick={() => setCardView(false)}>
                                        <img src="/images/assets/list-view-icon.svg" alt="list-view" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-row gap-2">
                                    <button onClick={() => setCardView(true)}>
                                        <img src="/images/assets/card-view-icon.svg" alt="card-view" />
                                    </button>
                                    <button onClick={() => setCardView(false)}>
                                        <img src="/images/assets/list-view-active-icon.svg" alt="list-view-active" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    {cardView ? <CardView pubs={publications} /> : <ListView pubs={publications} />}
                </div>
            </div>
        </>
    );
};

export default Home;
