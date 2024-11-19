import React, { useEffect, useState, useContext, useRef } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Author from '../interfaces/Author';
import { AuthContext } from '../hooks/AuthContext';
import { ExportDropdown } from '../components/DropdownButtons/ExportDropdown';
import { FilterDropdown } from '../components/DropdownButtons/FilterDropdown';
import PersonalChart, { AnnualChartRef } from '../components/Charts/StatisticsPage/PersonalChart';
import FeedbackModal from '../components/FeedbackModal/FeedbackModal';
import { Toast } from 'primereact/toast';

const Profile: React.FC = () => {
    // Set PI and data
    const [scientist, setScientist] = useState<Author | null>(null);
    const [piData, setPiData] = useState<any>(null);

    // Decoded jwt token of user (aka. signed in user's data)
    const authContext = useContext(AuthContext);

    // Used to navigate to a new page
    const navigate = useNavigate();

    // Chart variables
    const [chartData, setChartData] = useState<any | null>(null);
    const [legendItems, setLegendItems] = useState<string[]>([]);
    const [toggleDetailed, setToggleDetailed] = useState(false);
    const [activeLegendItems, setActiveLegendItems] = useState(new Set<string>());
    const chartRef = useRef<AnnualChartRef>(null);

    // feedback modal state variables
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const toast = useRef<Toast>(null);

    const toggleLegendItem = (item: string) => {
        setActiveLegendItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(item)) newSet.delete(item);
            else newSet.add(item);
            return newSet;
        });
    };

    const downloadChartImage = (format: string) => {
        if (chartRef.current) {
            chartRef.current.downloadChartImage(format);
        }
    };

    useEffect(() => {
        const getChartData = async () => {
            try {
                const res = await axios.get('/api/stats/supplementary');
                setChartData(res.data);

                // Extract legend items (dataset labels) dynamically
                const labels = res.data.datasets.map((dataset: any) => dataset.label);
                setLegendItems(labels);
                setActiveLegendItems(new Set(labels)); // Initialize all items as active
            } catch (error) {
                console.error('Error fetching chart data:', error);
            }
        };
        getChartData();
    }, []);

    // Fetch PI data from the backend if the logged in user is a PI
    useEffect(() => {
        const fetchPiData = async () => {
            try {
                const scientistData = await axios.post(`/api/authors/one`, {
                    email: authContext?.user.email
                });

                if (scientistData.data === 'Author not found') {
                    //If the PM author doesn't exist, don't continue with the data retrieval
                    setPiData('DNE');
                    return;
                }
                setScientist(scientistData.data);
                const enid = scientistData.data?.ENID.toString();
                const profileData = await axios.get(`/api/stats/author/${enid}`);
                setPiData(profileData.data);
            } catch (error) {
                console.error('Error fetching PI data:', error);
            }
        };

        const getChartData = async () => {
            try {
                const res = await axios.get('/api/stats/supplementary');
                setChartData(res.data);

                // Extract legend items (dataset labels) dynamically
                const labels = res.data.datasets.map((dataset: any) => dataset.label);
                setLegendItems(labels);
                setActiveLegendItems(new Set(labels)); // Initialize all items as active
            } catch (error) {
                console.error('Error fetching chart data:', error);
            }
        };

        if (authContext?.user != null) {
            fetchPiData();
            getChartData();
        }
    }, []);

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
                subject: subject,
                message: message,
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

    //If user is not a PI render a page without stats
    if (piData === 'DNE') {
        return (
            <div className="flex flex-col items-center py-36 smd:px-4 px-10 min-h-screen bg-white">
                <div className="flex flex-row smd:flex-col gap-5 justify-center mx-auto">
                    <div className="flex flex-col min-w-[285px]">
                        <div className="flex flex-col gap-5 ">
                            <div className="flex flex-col gap-2">
                                <div className="h-[140px] w-[140px] rounded-[120px] overflow-clip">
                                    <img src="/images/assets/default-user-icon.svg" alt="PI" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 text-black-900">
                                <h2 className="text-heading2Xl font-semibold">
                                    {authContext?.user.given_name} {authContext?.user.family_name}
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
                            </div>
                        </div>
                        <hr className="my-10 bg-gray-200 h-[1px]" />
                        <div className="flex flex-col gap-5">
                            <button
                                className="w-full border-1 border-open_border shadow-button rounded-[4px] p-2 text-headingSm text-black-900 font-semibold"
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
                    <div className="flex items-center justify-center w-[860px] md:w-[420px]">
                        <span className="text-bodyMd font-semibold text-gray-700">
                            User is not a PI at Princess Margaret Cancer Centre, no data to be loaded!
                        </span>
                    </div>
                </div>
                <Toast ref={toast} baseZIndex={1000} position="bottom-right" />
            </div>
        );
    }

    const { author, authorEmail, totalPublications, totalCitations, categoryStats } = piData;

    return (
        <div className="flex flex-col items-center py-36 smd:px-4 px-10 min-h-screen bg-white">
            <div className="flex flex-row smd:flex-col gap-5 justify-center mx-auto">
                <div className="flex flex-col min-w-[285px]">
                    <div className="flex flex-col gap-5 ">
                        <div className="flex flex-col gap-2">
                            <div className="h-[140px] w-[140px] rounded-[120px] overflow-clip">
                                <img src="/images/assets/default-user-icon.svg" alt="PI" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 text-black-900">
                            <h2 className="text-heading2Xl font-semibold">
                                {authContext?.user.given_name} {authContext?.user.family_name}
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
                            <div className="flex flex-row gap-2 items-center">
                                <img src="/images/assets/globe-icon.svg" alt="globe-icon" />
                                <a href="https://bhklab.ca" target="_blank" rel="noreferrer">
                                    <p className="text-bodyMd text-blue-600">Visit website</p>
                                </a>
                            </div>
                        </div>
                    </div>
                    <hr className="my-10 bg-gray-200 h-[1px]" />

                    <div className="flex flex-row gap-5 text-black-900">
                        <div className="flex flex-col gap-2">
                            <h3 className="text-heading3Xl font-semibold">{totalPublications}</h3>
                            <p className="text-bodyMd">Publications</p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <h3 className="text-heading3Xl font-semibold">{totalCitations}</h3>
                            <p className="text-bodyMd">Citations</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-5">
                        <button
                            className="w-full border-1 border-open_border shadow-button rounded-[4px] p-2 text-headingSm text-black-900 font-semibold"
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

                <div className="flex flex-col gap-5">
                    <div className="flex flex-row justify-between items-center w-full">
                        <h2 className="text-headingLg font-semibold text-black-900">Publication Statistics</h2>
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
                    <div className="flex flex-row items-center gap-5 flex-wrap w-[860px] wrap:w-[420px]">
                        {/* Code Section */}
                        <div
                            className={`flex flex-col gap-5 p-5 w-[420px] border-1 border-gray-200 rounded-lg overflow-hidden`}
                        >
                            <div className="flex flex-row justify-between items-start gap-4">
                                <div className="flex flex-col">
                                    <div className="flex flex-row gap-1 items-center mb-1">
                                        <img src="/images/assets/code-icon.svg" alt="code icon" />
                                        <p className="text-headingXs font-semibold">Code</p>
                                    </div>
                                    <h3 className="text-cyan-1100 text-headingXl mb-4 font-semibold">
                                        {categoryStats.code.authorContributions} code snippets
                                    </h3>
                                    <p className="text-bodySm">
                                        You are in the{' '}
                                        <span className="font-bold">
                                            {categoryStats.code.percentage < 50 ? 'top' : 'bottom'}{' '}
                                            {categoryStats.code.percentage}%{' '}
                                        </span>
                                        of code sharing in your publications.
                                    </p>
                                </div>
                                <div className="relative h-[100px] w-[100px] flex-shrink-0 overflow-visible">
                                    <img
                                        src={`/images/placeholders/${getPyramidImage(categoryStats.code.percentage)}`}
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
                                            {categoryStats.code.openSciencePercentage}% of your publications
                                        </span>{' '}
                                        share code with your community!
                                    </p>
                                    <div className="flex flex-row">
                                        <div
                                            className="bg-gradient-blue-cyan h-1.5 rounded-l-md"
                                            style={{ width: `${categoryStats.code.openSciencePercentage}%` }}
                                        />
                                        <div
                                            className="bg-gray-1000 h-1.5 rounded-r-md"
                                            style={{ width: `${100 - categoryStats.code.openSciencePercentage}%` }}
                                        />
                                    </div>
                                    <div className="flex flex-row justify-between">
                                        <p className="text-cyan-1000 text-bodySm font-bold">
                                            {categoryStats.code.authorContributions}
                                        </p>
                                        <p className="text-gray-700 text-bodySm font-bold">{totalPublications}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Data Section */}
                        <div className="flex flex-col gap-5 p-5 w-[420px] border-1 border-gray-200 rounded-lg overflow-hidden">
                            <div className="flex flex-row justify-between items-start gap-4">
                                <div className="flex flex-col">
                                    <div className="flex flex-row gap-1 items-center mb-1">
                                        <img src="/images/assets/code-icon.svg" alt="code icon" />
                                        <p className="text-headingXs font-semibold">Data</p>
                                    </div>
                                    <h3 className="text-cyan-1100 text-headingXl mb-4 font-semibold">
                                        {categoryStats.data.authorContributions} data points
                                    </h3>
                                    <p className="text-bodySm">
                                        You are in the{' '}
                                        <span className="font-bold">
                                            {categoryStats.data.percentage < 50 ? 'top' : 'bottom'}{' '}
                                            {categoryStats.data.percentage}%{' '}
                                        </span>
                                        of data sharing in your publications.
                                    </p>
                                </div>
                                <div className="relative h-[100px] w-[100px] flex-shrink-0 overflow-visible">
                                    <img
                                        src={`/images/placeholders/${getPyramidImage(categoryStats.data.percentage)}`}
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
                                            {categoryStats.data.openSciencePercentage}% of your publications
                                        </span>{' '}
                                        share data with your community!
                                    </p>
                                    <div className="flex flex-row">
                                        <div
                                            className={`bg-gradient-blue-cyan h-1.5 rounded-l-md`}
                                            style={{ width: `${categoryStats.data.openSciencePercentage}%` }}
                                        />
                                        <div
                                            className={`bg-gray-1000 h-1.5 rounded-r-md`}
                                            style={{ width: `${100 - categoryStats.data.openSciencePercentage}%` }}
                                        />
                                    </div>
                                    <div className="flex flex-row justify-between">
                                        <p className="text-cyan-1000 text-bodySm font-bold">
                                            {categoryStats.data.authorContributions}
                                        </p>
                                        <p className="text-gray-700 text-bodySm font-bold">{totalPublications}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Containers Section */}
                        <div className="flex flex-col gap-5 p-5 w-[420px] border-1 border-gray-200 rounded-lg overflow-hidden">
                            <div className="flex flex-row justify-between items-start gap-4">
                                <div className="flex flex-col">
                                    <div className="flex flex-row gap-1 items-center mb-1">
                                        <img src="/images/assets/code-icon.svg" alt="code icon" />
                                        <p className="text-headingXs font-semibold">Containers</p>
                                    </div>
                                    <h3 className="text-cyan-1100 text-headingXl mb-4 font-semibold">
                                        {categoryStats.containers.authorContributions} containers
                                    </h3>
                                    <p className="text-bodySm">
                                        You are in the{' '}
                                        <span className="font-bold">
                                            {categoryStats.containers.percentage < 50 ? 'top' : 'bottom'}{' '}
                                            {categoryStats.containers.percentage}%{' '}
                                        </span>
                                        of container sharing in your publications.
                                    </p>
                                </div>
                                <div className="relative h-[100px] w-[100px] flex-shrink-0 overflow-visible">
                                    <img
                                        src={`/images/placeholders/${getPyramidImage(categoryStats.containers.percentage)}`}
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
                                            {categoryStats.containers.openSciencePercentage}% of your publications
                                        </span>{' '}
                                        share containers with your community!
                                    </p>
                                    <div className="flex flex-row">
                                        <div
                                            className={`bg-gradient-blue-cyan h-1.5 rounded-l-md`}
                                            style={{ width: `${categoryStats.containers.openSciencePercentage}%` }}
                                        />
                                        <div
                                            className={`bg-gray-1000 h-1.5 rounded-r-md`}
                                            style={{
                                                width: `${100 - categoryStats.containers.openSciencePercentage}%`
                                            }}
                                        />
                                    </div>
                                    <div className="flex flex-row justify-between">
                                        <p className="text-cyan-1000 text-bodySm font-bold">
                                            {categoryStats.containers.authorContributions}
                                        </p>
                                        <p className="text-gray-700 text-bodySm font-bold">{totalPublications}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Clinical Trials Section */}
                        <div className="flex flex-col gap-5 p-5 w-[420px] border-1 border-gray-200 rounded-lg overflow-hidden">
                            <div className="flex flex-row justify-between items-start gap-4">
                                <div className="flex flex-col">
                                    <div className="flex flex-row gap-1 items-center mb-1">
                                        <img src="/images/assets/code-icon.svg" alt="code icon" />
                                        <p className="text-headingXs font-semibold">Clinical Trials</p>
                                    </div>
                                    <h3 className="text-cyan-1100 text-headingXl mb-4 font-semibold">
                                        {categoryStats.trials.authorContributions} clinical trials
                                    </h3>
                                    <p className="text-bodySm">
                                        You are in the{' '}
                                        <span className="font-bold">
                                            {categoryStats.trials.percentage < 50 ? 'top' : 'bottom'}{' '}
                                            {categoryStats.trials.percentage}%{' '}
                                        </span>
                                        of clinical trial sharing in your publications.
                                    </p>
                                </div>
                                <div className="relative h-[100px] w-[100px] flex-shrink-0 overflow-visible">
                                    <img
                                        src={`/images/placeholders/${getPyramidImage(categoryStats.trials.percentage)}`}
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
                                            {categoryStats.trials.openSciencePercentage}% of your publications
                                        </span>{' '}
                                        share clinical trials with your community!
                                    </p>
                                    <div className="flex flex-row">
                                        <div
                                            className={`bg-gradient-blue-cyan h-1.5 rounded-l-md`}
                                            style={{ width: `${categoryStats.trials.openSciencePercentage}%` }}
                                        />
                                        <div
                                            className={`bg-gray-1000 h-1.5 rounded-r-md`}
                                            style={{ width: `${100 - categoryStats.trials.openSciencePercentage}%` }}
                                        />
                                    </div>
                                    <div className="flex flex-row justify-between">
                                        <p className="text-cyan-1000 text-bodySm font-bold">
                                            {categoryStats.trials.authorContributions}
                                        </p>
                                        <p className="text-gray-700 text-bodySm font-bold">{totalPublications}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Analysis Results Section */}
                        <div className="flex flex-col gap-5 p-5 w-[420px] border-1 border-gray-200 rounded-lg overflow-hidden">
                            <div className="flex flex-row justify-between items-start gap-4">
                                <div className="flex flex-col">
                                    <div className="flex flex-row gap-1 items-center mb-1">
                                        <img src="/images/assets/code-icon.svg" alt="code icon" />
                                        <p className="text-headingXs font-semibold">Analysis Results</p>
                                    </div>
                                    <h3 className="text-cyan-1100 text-headingXl mb-4 font-semibold">
                                        {categoryStats.results.authorContributions} results
                                    </h3>
                                    <p className="text-bodySm">
                                        You are in the{' '}
                                        <span className="font-bold">
                                            {categoryStats.results.percentage < 50 ? 'top' : 'bottom'}{' '}
                                            {categoryStats.results.percentage}%{' '}
                                        </span>
                                        of results sharing in your publications.
                                    </p>
                                </div>
                                <div className="relative h-[100px] w-[100px] flex-shrink-0 overflow-visible">
                                    <img
                                        src={`/images/placeholders/${getPyramidImage(categoryStats.results.percentage)}`}
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
                                            {categoryStats.results.openSciencePercentage}% of your publications
                                        </span>{' '}
                                        share results with your community!
                                    </p>
                                    <div className="flex flex-row">
                                        <div
                                            className={`bg-gradient-blue-cyan h-1.5 rounded-l-md`}
                                            style={{ width: `${categoryStats.results.openSciencePercentage}%` }}
                                        />
                                        <div
                                            className={`bg-gray-1000 h-1.5 rounded-r-md`}
                                            style={{ width: `${100 - categoryStats.results.openSciencePercentage}%` }}
                                        />
                                    </div>
                                    <div className="flex flex-row justify-between">
                                        <p className="text-cyan-1000 text-bodySm font-bold">
                                            {categoryStats.results.authorContributions}
                                        </p>
                                        <p className="text-gray-700 text-bodySm font-bold">{totalPublications}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col px-10 gap-3 md:px-10 sm:px-0 bg-white border-1 border-gray-200 rounded-md w-full">
                            <div className="flex flex-row justify-between items-center">
                                <h1 className="text-heading2Xl font-semibold py-10">My Publication Statistics</h1>
                                <div className="flex flex-row gap-4">
                                    <FilterDropdown
                                        legendItems={legendItems}
                                        activeItems={activeLegendItems}
                                        toggleLegendItem={toggleLegendItem}
                                    />
                                    <ExportDropdown onDownload={downloadChartImage} />
                                </div>
                            </div>

                            <div className="chart-container relative w-full" style={{ height: '700px' }}>
                                <PersonalChart
                                    ref={chartRef}
                                    chartData={chartData}
                                    activeLegendItems={activeLegendItems}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Toast ref={toast} baseZIndex={1000} position="bottom-right" />
        </div>
    );
};

export default Profile;
