import React, { useEffect, useState, useContext, useRef } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Author from '../interfaces/Author';
import { AuthContext } from '../hooks/AuthContext';
import { ExportDropdown } from '../components/DropdownButtons/ExportDropdown';
import { FilterDropdown } from '../components/DropdownButtons/FilterDropdown';
import PersonalBarChart, { PersonalBarChartRef } from '../components/Charts/Profile/PersonalBarChart';
import PersonalScatterPlot, { PersonalScatterPlotRef } from '../components/Charts/Profile/PersonalScatterPlot';
// import PersonalViolinPlot, { PersonalViolinPlotRef } from '../components/Charts/Profile/PersonalViolinPlot';
import FeedbackModal from '../components/FeedbackModal/FeedbackModal';
import { Toast } from 'primereact/toast';
import { Link } from 'react-scroll';

const Profile: React.FC = () => {
    // Set PI and data
    const [scientist, setScientist] = useState<Author | null>(null);
    const [piData, setPiData] = useState<any>(null);
    const [enid, setEnid] = useState<number>(-1);

    // Decoded jwt token of user (aka. signed in user's data)
    const authContext = useContext(AuthContext);

    // Used to navigate to a new page
    const navigate = useNavigate();

    // UPDATED: Ensure statIndex matches the new "type" strings from your stats data
    const sections = [
        {
            name: 'Code',
            description: 'code snippets',
            sentence: 'code',
            statIndex: 'Code',
            image: 'code-icon.svg'
        },
        {
            name: 'Data',
            description: 'data points',
            sentence: 'data',
            statIndex: 'Data',
            image: 'data-icon.svg'
        },
        {
            name: 'Containers',
            description: 'containers',
            sentence: 'container',
            statIndex: 'Containers',
            image: 'containers-icon.svg'
        },
        {
            name: 'Trials',
            description: 'clinical trials',
            sentence: 'clinical trial',
            statIndex: 'Trials',
            image: 'clinicaltrials-icon.svg'
        },
        {
            name: 'Results',
            description: 'results',
            sentence: 'result',
            statIndex: 'Results',
            image: 'results-icon.svg'
        }
        // {
        // 	name: 'Packages',
        // 	description: 'software packages',
        //	sentence: 'package',
        // 	statIndex: 'Packages',
        // 	image: 'packages-icon.svg'
        // },
    ];

    // Bar Chart variables
    const [barChartData, setBarChartData] = useState<any | null>(null);
    const [legendItems, setLegendItems] = useState<string[]>([]);
    const [barActiveLegendItems, setBarActiveLegendItems] = useState(new Set<string>());
    const barChartRef = useRef<PersonalBarChartRef>(null);

    // Scatter Chart variables
    const [scatterPlotData, setScatterPlotData] = useState<any | null>(null);
    const [scatterActiveLegendItems, setScatterActiveLegendItems] = useState(new Set<string>());
    const scatterPlotRef = useRef<PersonalScatterPlotRef>(null);

    // Violin Chart variables
    // const [violinPlotData, setViolinPlotData] = useState<any | null>(null);
    // const [violinActiveLegendItems, setViolinActiveLegendItems] = useState(new Set<string>());
    // const violinPlotRef = useRef<PersonalViolinPlotRef>(null);

    // feedback modal state variables
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [toggleDetailed, setToggleDetailed] = useState(true);
    const toast = useRef<Toast>(null);

    const toggleLegendItem = (item: string, chartType: string) => {
        if (chartType === 'scatter') {
            setScatterActiveLegendItems(prev => {
                const newSet = new Set(prev);
                if (newSet.has(item)) newSet.delete(item);
                else newSet.add(item);
                return newSet;
            });
        } else if (chartType === 'bar') {
            setBarActiveLegendItems(prev => {
                const newSet = new Set(prev);
                if (newSet.has(item)) newSet.delete(item);
                else newSet.add(item);
                return newSet;
            });
        }
    };

    const downloadChartImage = (format: 'jpeg' | 'png' | 'webp' | 'svg', chartType: string) => {
        if (chartType === 'scatter') {
            if (scatterPlotRef.current) {
                scatterPlotRef.current.downloadChartImage(format);
            }
        } else if (chartType === 'bar') {
            if (barChartRef.current) {
                barChartRef.current.downloadChartImage(format);
            }
        }
    };

    // Fetch PI data from the backend if the logged in user is a PI
    useEffect(() => {
        const fetchPiData = async () => {
            try {
                const scientistData = await axios.post(`/api/authors/one`, {
                    email: authContext?.user.email
                });

                if (scientistData.data === 'Author not found') {
                    // If the PM author doesn't exist, don't continue with the data retrieval
                    setPiData('DNE');
                    return;
                }
                setScientist(scientistData.data);
                setEnid(scientistData.data?.ENID);

                const profileData = await axios.get(`/api/stats/author/${scientistData.data?.ENID.toString()}`);

                // Build scatterPlotData
                const transformedScatterData = {
                    datasets: Object.entries(profileData.data.platformRankings).map(([category, entries]) => {
                        const data = entries as Array<{
                            rank: number;
                            contributions: number;
                            name: string;
                            enid: number;
                        }>;

                        return {
                            label: category,
                            data: data.map(entry => ({
                                x: entry.rank,
                                y: entry.contributions,
                                label: `${entry.name} (${entry.contributions} ${category} contributions, ranked ${entry.rank} at PM)`
                            })),
                            pointBackgroundColor: data.map(entry =>
                                entry.enid === scientistData.data?.ENID
                                    ? 'rgba(255, 99, 132, 1)'
                                    : 'rgba(75, 192, 192, 1)'
                            ),
                            pointBorderColor: data.map(entry =>
                                entry.enid === scientistData.data?.ENID
                                    ? 'rgba(255, 99, 132, 1)'
                                    : 'rgba(75, 192, 192, 1)'
                            ),
                            pointRadius: data.map(entry => (entry.enid === scientistData.data?.ENID ? 10 : 5))
                        };
                    })
                };
                setScatterPlotData(transformedScatterData);

                // Extract labels for the legend
                const scatterLabels = transformedScatterData.datasets.map(dataset => dataset.label!);
                setLegendItems(scatterLabels);

                // By default, show only "Code" in the scatter plot's legend
                setScatterActiveLegendItems(new Set(['Code']));

                setPiData(profileData.data);
            } catch (error) {
                console.error('Error fetching PI data:', error);
            }
        };

        const getChartData = async () => {
            try {
                const res = await axios.put('/api/stats/supplementary/author', {
                    email: authContext?.user.email
                });
                setBarChartData(res.data);

                // Extract legend items (dataset labels) from the bar chart data
                const labels = res.data.datasets.map((dataset: { label: string }) => dataset.label);
                setLegendItems(labels);
                setBarActiveLegendItems(new Set(labels));
            } catch (error) {
                console.error('Error fetching chart data:', error);
            }
        };

        if (authContext?.user != null) {
            fetchPiData();
            getChartData();
        }
    }, [authContext?.user]);

    // Map percentage to pyramid image
    const getPyramidImage = (percentage: number) => {
        if (percentage >= 81 && percentage <= 100) return 'pyramid-6.svg';
        if (percentage >= 61 && percentage <= 80) return 'pyramid-5.svg';
        if (percentage >= 41 && percentage <= 60) return 'pyramid-4.svg';
        if (percentage >= 21 && percentage <= 40) return 'pyramid-3.svg';
        if (percentage >= 5 && percentage <= 20) return 'pyramid-2.svg';
        return 'pyramid-1.svg';
    };

    // Show spinner while loading data
    if (!piData) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <ProgressSpinner
                    style={{ width: '200px', height: '200px' }}
                    strokeWidth="4"
                    fill="var(--surface-ground)"
                    animationDuration="1s"
                />
            </div>
        );
    }

    const submitFeedback = async (subject: string, message: string) => {
        try {
            await axios.post(`/api/feedback/submit`, {
                subject,
                message,
                email: authContext?.user.email
            });
            toast.current?.show({
                severity: 'success',
                summary: 'Feedback Submitted',
                detail: 'Your valued feedback has been sent to the Science Portal team. Lookout for a response in the coming days!',
                life: 8000
            });
            setIsVisible(false);
        } catch (error) {
            console.log(error);
        }
    };

    // Finally, if user is a PI, show stats
    const { author, authorEmail, totalPublications, totalCitations, categoryStats } = piData;

    const getFirstName = (email: string) => {
        let firstName = email.substring(0, email.indexOf('.'));
        firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
        return firstName;
    };

    const getLastName = (email: string) => {
        let lastName = email.substring(email.indexOf('.') + 1, email.indexOf('@'));
        lastName = lastName.charAt(0).toUpperCase() + lastName.slice(1);
        return lastName;
    };

    return (
        <div className="flex flex-col items-center py-36 smd:px-4 px-10 min-h-screen bg-white">
            <div className="flex flex-row smd:flex-col gap-5 justify-center mx-auto">
                <div className="flex flex-col min-w-[285px] gap-10 sticky smd:static top-36 h-fit smd:mb-10">
                    <div className="flex flex-col gap-5 smd:justify-center smd:items-center ">
                        <div className="flex flex-col gap-2">
                            <div className="h-[140px] w-[140px] rounded-[120px] overflow-clip">
                                <img src="/images/assets/default-user-icon.svg" alt="PI" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 text-black-900">
                            <h2 className="text-heading2Xl font-semibold">
                                {getFirstName(authContext?.user.email)} {getLastName(authContext?.user.email)}
                            </h2>
                            <p className="text-headingMd">{scientist?.primaryAppointment}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-row gap-2 items-center">
                                <img src="/images/assets/briefcase-icon.svg" alt="briefcase-icon" />
                                <p className="text-bodyMd">Princess Margaret Cancer Centre</p>
                            </div>
                            <div className="flex flex-row gap-2 items-center">
                                <img src="/images/assets/mail-icon.svg" alt="mail-icon" />
                                <p className="text-bodyMd">{authContext?.user.email}</p>
                            </div>
                            {/* <div className="flex flex-row gap-2 items-center">
                                <img src="/images/assets/globe-icon.svg" alt="globe-icon" />
                                <a href="https://bhklab.ca" target="_blank" rel="noreferrer">
                                    <p className="text-bodyMd text-blue-600">Visit website</p>
                                </a>
                            </div> */}
                        </div>
                    </div>
                    <hr className="bg-gray-200 h-[1px]" />

                    {piData !== 'DNE' ? (
                        <div className="flex flex-row gap-5 text-black-900 smd:justify-center ">
                            <div className="flex flex-col gap-2">
                                <h3 className="text-heading3Xl font-semibold">{totalPublications}</h3>
                                <p className="text-bodyMd">Publications</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <h3 className="text-heading3Xl font-semibold">{totalCitations}</h3>
                                <p className="text-bodyMd">Citations</p>
                            </div>
                        </div>
                    ) : null}

                    <div className="flex flex-col gap-5 smd:items-center">
                        <button
                            className="w-full border-1 border-open_border shadow-button rounded-[4px] p-2 text-headingSm text-black-900 font-semibold max-w-72"
                            onClick={() => navigate('/submit-publication')}
                        >
                            Submit a publication
                        </button>
                        <div className="flex flex-row justify-center items-center">
                            <button className="text-blue-1100 text-sm" onClick={() => setIsVisible(true)}>
                                Send Feedback
                            </button>
                            <FeedbackModal
                                isVisible={isVisible}
                                setIsVisible={setIsVisible}
                                submitFeedback={submitFeedback}
                            />
                        </div>
                    </div>
                </div>

                {piData !== 'DNE' ? (
                    <div className="flex flex-col gap-5">
                        <div className="flex flex-row justify-between items-center w-full">
                            <div className="flex flex-col">
                                <h2 className="text-headingLg font-semibold text-black-900">
                                    My Publication Statistics
                                </h2>
                                <p className="text-bodySm text-gray-500 ">
                                    Total publications of yours that contain at least one resource
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <label htmlFor="toggle-slider" className="text-bodyMd font-medium">
                                    Detailed View
                                </label>
                                <div
                                    onClick={() => setToggleDetailed(prev => !prev)}
                                    className={`relative inline-flex h-6 w-12 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ease-in-out ${
                                        toggleDetailed ? 'bg-blue-500' : 'bg-gray-300'
                                    }`}
                                >
                                    <span
                                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
                                            toggleDetailed ? 'translate-x-6' : 'translate-x-0'
                                        }`}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row items-center gap-5 flex-wrap w-[860px] wrap:w-[600px] wrapSmall:w-[450px] sm:w-[420px] xs:w-[350px] ">
                            {/* Sections */}
                            {sections.map(item => (
                                <div
                                    className={`flex flex-col gap-5 p-5 w-[420px] xs:w-[350px] wrap:w-full border-1 border-gray-200 rounded-lg overflow-hidden`}
                                >
                                    <div className="flex flex-row justify-between items-start gap-4">
                                        <div className="flex flex-col">
                                            <div className="flex flex-row gap-1 items-center mb-1">
                                                <img src={`/images/assets/${item.image}`} alt={item.name} />
                                                <p className="text-headingXs font-semibold">{item.name}</p>
                                            </div>
                                            <h3 className="text-cyan-1100 text-headingXl mb-4 font-semibold">
                                                {categoryStats[item.statIndex].authorContributions} publications with{' '}
                                                {item.description}
                                            </h3>
                                            {/* <p className="text-bodySm">
                                                You are in the{' '}
                                                <span className="font-bold">
                                                    {categoryStats[item.statIndex].percentage < 50 ? 'top' : 'bottom'}{' '}
                                                    {categoryStats[item.statIndex].percentage}%
                                                </span>{' '}
                                                of {item.name.toLowerCase()} sharing in your publications.
                                            </p> */}
                                            <p className="text-bodySm">
                                                You are in the{' '}
                                                <span className="font-bold">
                                                    {categoryStats[item.statIndex].percentage < 50 ? 'top' : 'bottom'}{' '}
                                                    {categoryStats[item.statIndex].percentage}%
                                                </span>{' '}
                                                of {item.sentence} sharing within publications at Princess Margaret.
                                            </p>
                                        </div>
                                        <div className="relative h-[100px] w-[100px] flex-shrink-0 overflow-visible">
                                            <img
                                                src={`/images/placeholders/${getPyramidImage(
                                                    categoryStats[item.statIndex].percentage
                                                )}`}
                                                alt="pyramids"
                                                className="absolute bottom-0 left-0"
                                                style={{ height: '150%', width: '200%' }}
                                            />
                                        </div>
                                    </div>

                                    {toggleDetailed && (
                                        <div className="flex flex-col gap-2 animate-show">
                                            <p className="text-bodySm">
                                                <span className="font-bold">
                                                    {categoryStats[item.statIndex].openSciencePercentage}% of your
                                                    publications
                                                </span>{' '}
                                                share {item.name.toLowerCase()} with your community!
                                            </p>
                                            <div className="flex flex-row">
                                                <div
                                                    className="bg-gradient-blue-cyan h-1.5 rounded-l-md"
                                                    style={{
                                                        width: `${categoryStats[item.statIndex].openSciencePercentage}%`
                                                    }}
                                                />
                                                <div
                                                    className="bg-gray-1000 h-1.5 rounded-r-md"
                                                    style={{
                                                        width: `${
                                                            100 - categoryStats[item.statIndex].openSciencePercentage
                                                        }%`
                                                    }}
                                                />
                                            </div>
                                            <div className="flex flex-row justify-between">
                                                <p className="text-cyan-1000 text-bodySm font-bold">
                                                    {categoryStats[item.statIndex].authorContributions}
                                                </p>
                                                <p className="text-gray-700 text-bodySm font-bold">
                                                    {totalPublications}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Bar Chart */}
                            <div className="flex flex-col gap-3 px-10 sm:px-2 bg-white border-1 border-gray-200 rounded-md w-full">
                                <div className="flex flex-row justify-between items-center">
                                    <div className="flex flex-col py-10">
                                        <h1 className="text-heading2Xl sm:text-headingLg font-semibold ">
                                            My Annual Resource Sharing
                                        </h1>
                                        <p className="text-bodySm sm:text-bodyXs text-gray-500 align-center">
                                            Total publications of yours that share resources
                                        </p>
                                    </div>
                                    <div className="flex flex-row sm:flex-col gap-4">
                                        <FilterDropdown
                                            legendItems={legendItems}
                                            activeItems={barActiveLegendItems}
                                            toggleLegendItem={toggleLegendItem}
                                            chartType="bar"
                                        />
                                        <ExportDropdown
                                            onDownload={format =>
                                                downloadChartImage(format as 'jpeg' | 'png' | 'webp' | 'svg', 'bar')
                                            }
                                            chartType="bar"
                                        />
                                    </div>
                                </div>

                                <div
                                    className="chart-container relative w-full"
                                    style={{ height: '500px', paddingBottom: '20px' }}
                                >
                                    <PersonalBarChart
                                        ref={barChartRef}
                                        chartData={barChartData}
                                        activeLegendItems={barActiveLegendItems}
                                    />
                                </div>
                            </div>

                            {/* Scatter Plot */}
                            <div
                                className="flex flex-col gap-3 px-10 sm:px-2 bg-white border-1 border-gray-200 rounded-md w-full"
                                id="scatter-plot"
                            >
                                <div className="flex flex-row justify-between items-center">
                                    <div className="flex flex-col py-10">
                                        <h1 className="text-heading2Xl sm:text-headingLg font-semibold ">
                                            My Resource Sharing Rank
                                        </h1>
                                        <p className="text-bodySm sm:text-bodyXs text-gray-500 ">
                                            Your resource sharing vs the institutions resource sharing
                                        </p>
                                    </div>
                                    <div className="flex flex-row sm:flex-col gap-4">
                                        <FilterDropdown
                                            legendItems={legendItems}
                                            activeItems={scatterActiveLegendItems}
                                            toggleLegendItem={toggleLegendItem}
                                            chartType="scatter"
                                        />
                                        <ExportDropdown
                                            onDownload={format =>
                                                downloadChartImage(format as 'jpeg' | 'png' | 'webp' | 'svg', 'scatter')
                                            }
                                            chartType="scatter"
                                        />
                                    </div>
                                </div>

                                <div className="chart-container relative w-full" style={{ height: '425px' }}>
                                    <PersonalScatterPlot
                                        ref={scatterPlotRef}
                                        chartData={scatterPlotData}
                                        activeLegendItems={scatterActiveLegendItems}
                                        enid={enid}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center w-[860px] md:w-[420px]">
                        <span className="text-bodyMd font-semibold text-gray-700">
                            User is not a PI at Princess Margaret Cancer Centre, no data to be loaded!
                        </span>
                    </div>
                )}
            </div>
            <Toast ref={toast} baseZIndex={1000} position="bottom-right" />
        </div>
    );
};

export default Profile;
