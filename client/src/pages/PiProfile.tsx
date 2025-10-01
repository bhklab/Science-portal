import React, { useEffect, useState, useContext, useRef, useMemo } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import axios from 'axios';
import ExportDomButton from 'components/DropdownButtons/ExportDomButton';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';

import { AuthContext } from '../hooks/AuthContext';
import Author from '../interfaces/Author';

import AnnualChart, { AnnualChartRef } from 'components/Charts/StatisticsPage/AnnualChart';
import PersonalScatterPlot, { PersonalScatterPlotRef } from '../components/Charts/Profile/PersonalScatterPlot';
import PersonalHistogram, { PersonalHistogramRef } from '../components/Charts/Profile/PersonalHistogram';
import { ExportDropdown } from '../components/DropdownButtons/ExportDropdown';
import { FilterDropdown } from '../components/DropdownButtons/FilterDropdown';
import FeedbackModal from '../components/FeedbackModal/FeedbackModal';

// Example resource sections used for stats
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
];

const PiProfile: React.FC = () => {
    // PI data
    const [scientist, setScientist] = useState<Author | null>(null);
    const [piData, setPiData] = useState<any | null>(null);
    const [enid, setEnid] = useState<number>(-1);
    const [mailOptIn, setMailOptIn] = useState<boolean>(false);

    // Chart data
    const [barChartData, setBarChartData] = useState<any | null>(null);
    const [scatterPlotData, setScatterPlotData] = useState<any | null>(null);
    const [histogramData, setHistogramData] = useState<any | null>(null);

    // Resource legend management for charts
    const [legendItems, setLegendItems] = useState<string[]>([]);
    const [barActiveLegendItems, setBarActiveLegendItems] = useState<Set<string>>(new Set());
    const [scatterActiveLegendItems, setScatterActiveLegendItems] = useState<Set<string>>(new Set(['code']));
    const [histogramActiveLegendItems, setHistogramActiveLegendItems] = useState<Set<string>>(new Set());

    // Year legend management for charts
    const [yearRange, setYearRange] = useState<[number, number] | null>(null);
    const [barMinMaxYear, setBarMinMaxYear] = useState<{ minYear: number | null; maxYear: number | null }>({
        minYear: null,
        maxYear: null
    });
    const [scatterMinMaxYear, setScatterMinMaxYear] = useState<{ minYear: number | null; maxYear: number | null }>({
        minYear: null,
        maxYear: null
    });

    // Chart references
    const barChartRef = useRef<AnnualChartRef>(null);
    const scatterPlotRef = useRef<PersonalScatterPlotRef>(null);
    const histogramRef = useRef<PersonalHistogramRef>(null);

    // Feedback modal state
    const [isVisible, setIsVisible] = useState<boolean>(false);
    // Toggle for detailed stats sections
    const [toggleDetailed, setToggleDetailed] = useState<boolean>(false);
    const toast = useRef<Toast>(null);

    // Decoded JWT token of user (aka. signed in user's data)
    const authContext = useContext(AuthContext);

    //
    const exportRef = useRef<HTMLDivElement>(null);

    // Used to navigate to a new page
    const navigate = useNavigate();

    // Toggling the legend items for bar or scatter chart
    const toggleLegendItem = (item: string, chartType: string) => {
        if (chartType === 'bar') {
            setBarActiveLegendItems(prev => {
                const newSet = new Set(prev);
                newSet.has(item) ? newSet.delete(item) : newSet.add(item);
                return newSet;
            });
        } else if (chartType === 'scatter') {
            setScatterActiveLegendItems(new Set([item]));
        } else if (chartType === 'histogram') {
            setHistogramActiveLegendItems(new Set([item]));
        }
    };

    // Chart image download
    const downloadChartImage = (format: 'jpeg' | 'png' | 'webp' | 'svg', chartType: string) => {
        if (chartType === 'scatter' && scatterPlotRef.current) {
            scatterPlotRef.current.downloadChartImage(format);
        } else if (chartType === 'bar' && barChartRef.current) {
            barChartRef.current.downloadChartImage(format);
        } else if (chartType === 'histogram' && histogramRef.current) {
            histogramRef.current.downloadChartImage(format);
        }
    };

    // Fetch PI data from the backend
    useEffect(() => {
        const fetchPiData = async () => {
            try {
                const mailingStatus = await axios.post(`/api/mailing/status`, {
                    email: authContext?.user?.email
                });

                setMailOptIn(mailingStatus.data);

                const scientistData = await axios.post(`/api/authors/one`, {
                    email: authContext?.user?.email
                });

                if (!scientistData.data || scientistData.data === 'Author not found') {
                    setPiData('DNE');
                    return;
                }

                setScientist(scientistData.data);
                setEnid(scientistData.data.ENID);

                // Bar chart data
                const barResponse = await axios.put('/api/stats/supplementary/author', {
                    email: authContext?.user?.email
                });
                setBarChartData(barResponse.data);

                // Scatter chart data
                const scatterResponse = await axios.get(`/api/stats/author/${scientistData.data.ENID}`);
                setPiData(scatterResponse.data);
                setScatterPlotData(scatterResponse.data.scatterData);

                // New histogram data
                const histogramResponse = await axios.get(`/api/stats/author/${scientistData.data.ENID}/histogram`);
                setHistogramData(histogramResponse.data);

                // Process all labels for the shared legend
                if (scatterResponse.data.scatterData?.datasets) {
                    const barLabels = barResponse.data.datasets.map((d: any) => d.label);
                    const scatterLabels = scatterResponse.data.scatterData.datasets.map((ds: any) => ds.label);
                    const histogramLabels = histogramResponse.data.datasets.map((ds: any) => ds.label);

                    // Merge all labels
                    const combinedSet = new Set([...barLabels, ...scatterLabels, ...histogramLabels]);
                    const combinedArr = Array.from(combinedSet);

                    setLegendItems(combinedArr);

                    // By default, show all for bar chart and only Code for scatter and histogram
                    setBarActiveLegendItems(new Set(combinedArr));
                    setScatterActiveLegendItems(new Set(['Code']));
                    setHistogramActiveLegendItems(new Set(['Code']));
                }

                // Years from x-axis labels
                const years = (barResponse.data.labels as (string | number)[]) || [];

                // Normalize numbers for slider logic
                const numericYears = years
                    .map(y => (typeof y === 'string' ? parseInt(y, 10) : y))
                    .filter(y => !Number.isNaN(y)) as number[];

                if (numericYears.length > 0) {
                    const yMin = Math.min(...numericYears);
                    const yMax = Math.max(...numericYears);
                    setBarMinMaxYear({
                        minYear: yMin,
                        maxYear: yMax
                    });
                    setScatterMinMaxYear({
                        minYear: yMin,
                        maxYear: yMax
                    });
                    setYearRange([yMin, yMax]);
                } else {
                    setBarMinMaxYear({
                        minYear: null,
                        maxYear: null
                    });
                    setScatterMinMaxYear({
                        minYear: null,
                        maxYear: null
                    });
                    setYearRange(null);
                }
            } catch (err) {
                console.error('Error fetching data for user profile:', err);
            }
        };

        if (authContext?.user) {
            fetchPiData();
        }
    }, [authContext?.user]);

    // Legend + optional year filter (use for BAR / HIST where labels are years)
    function filterByLegendAndYear(
        chartData: any | null,
        activeLegendItems: Set<string>,
        yearRange: [number, number] | null,
        minMaxYear: { minYear: number | null; maxYear: number | null }
    ) {
        if (!chartData) return null;

        // If no year filtering available, just legend-filter
        if (!yearRange || minMaxYear.minYear == null || minMaxYear.maxYear == null) {
            const datasets = (chartData.datasets || []).filter((ds: any) => activeLegendItems.has(ds.label));
            return { ...chartData, datasets };
        }

        const [low, high] = yearRange;

        const keepIdx: number[] = [];
        (chartData.labels || []).forEach((lbl: string | number, i: number) => {
            const yr = typeof lbl === 'string' ? parseInt(lbl, 10) : lbl;
            if (typeof yr === 'number' && !Number.isNaN(yr) && yr >= low && yr <= high) {
                keepIdx.push(i);
            }
        });

        const filteredLabels = keepIdx.map(i => chartData.labels[i]);
        const filteredDatasets = (chartData.datasets || [])
            .filter((ds: any) => activeLegendItems.has(ds.label))
            .map((ds: any) => ({ ...ds, data: keepIdx.map(i => ds.data[i]) }));

        return { ...chartData, labels: filteredLabels, datasets: filteredDatasets };
    }

    const filteredBarChartData = useMemo(() => {
        return filterByLegendAndYear(barChartData, barActiveLegendItems, yearRange, barMinMaxYear);
    }, [barChartData, barActiveLegendItems, yearRange, barMinMaxYear]);

    // For the pyramid icons
    const getPyramidImage = (percentage: number) => {
        if (percentage >= 81) return 'pyramid-6.svg';
        if (percentage >= 61) return 'pyramid-5.svg';
        if (percentage >= 41) return 'pyramid-4.svg';
        if (percentage >= 21) return 'pyramid-3.svg';
        if (percentage >= 5) return 'pyramid-2.svg';
        return 'pyramid-1.svg';
    };

    // Submitting feedback
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
                detail: 'Your valued feedback has been sent to the Science Portal team. Watch for a response soon!',
                life: 8000
            });
            setIsVisible(false);
        } catch (error) {
            console.log(error);
        }
    };

    const mailingOpt = async () => {
        try {
            const mail = await axios.post('/api/mailing/opting', {
                email: authContext?.user?.email,
                mailOptIn: mailOptIn
            });
            setMailOptIn(mail.data);
        } catch (error) {
            console.error('Error updating mailing preference:', error);
        }
    };

    // Helper for first name
    const getFirstName = (email: string) => {
        let firstName = email.substring(0, email.indexOf('.'));
        return firstName.charAt(0).toUpperCase() + firstName.slice(1);
    };

    // Helper for last name
    const getLastName = (email: string) => {
        let lastName = email.substring(email.indexOf('.') + 1, email.indexOf('@'));
        return lastName.charAt(0).toUpperCase() + lastName.slice(1);
    };

    // Show spinner until piData is loaded
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

    // If user is not found as an author
    if (piData === 'DNE') {
        return (
            <div className="flex flex-col items-center py-36 smd:px-4 px-10 min-h-screen bg-white">
                <div className="flex flex-row smd:flex-col smd:items-center gap-5 justify-center mx-auto">
                    <div className="flex flex-col max-w-[285px] gap-10 sticky smd:static top-36 h-fit smd:mb-10">
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
                            </div>
                        </div>
                        <hr className="bg-gray-200 h-[1px]" />

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
                        <div className="flex flex-row justify-center items-center gap-2">
                            <input
                                type="checkbox"
                                checked={mailOptIn}
                                onChange={() => mailingOpt()}
                                className="mr-2 rounded-sm"
                            />
                            <p className="text-bodySm">
                                Sign up for our monthly email newsletter and publication highlights
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center justify-center w-[860px] md:w-[420px]">
                        <span className="text-bodyMd font-semibold text-gray-700 text-center">
                            User is currently not a tracked scientist at Princess Margaret. If you would like to request
                            yourself as a trackable user, please make a request through the Send Feedback portal.
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    // De-structure stats
    const { totalPublications, totalCitations, categoryStats } = piData;

    return (
        <div className="flex flex-col items-center py-36 smd:px-4 px-10 min-h-screen bg-white">
            <div className="flex flex-row smd:flex-col smd:items-center gap-5 justify-center mx-auto">
                <div className="flex flex-col max-w-[285px] gap-10 sticky smd:static top-36 h-fit smd:mb-10">
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
                        </div>
                    </div>
                    <hr className="bg-gray-200 h-[1px]" />

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
                        <div className="flex flex-row justify-center items-center gap-2">
                            <input
                                type="checkbox"
                                checked={mailOptIn}
                                onChange={() => mailingOpt()}
                                className="mr-2 rounded-sm"
                            />
                            <p className="text-bodySm">
                                Sign up for our monthly email newsletter and publication highlights
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-5 xs:justify-center xs:items-center">
                    <div className="flex flex-row justify-between items-center w-full xs:gap-2">
                        <div className="flex flex-col xs:max-w-[60%]">
                            <h2 className="text-headingLg xs:text-headingMd font-semibold text-black-900">
                                My Publication Statistics
                            </h2>
                            <p className="text-bodySm xs:text-bodyXs text-gray-500">
                                Total publications of yours that contain at least one resource
                            </p>
                        </div>
                        <div className="flex flex-row gap-1">
                            <ExportDomButton targetRef={exportRef} filename="open_science_adherence" />

                            <div className="flex items-center gap-2 xs:flex-col xs:items-start">
                                <label htmlFor="toggle-slider" className="text-bodyMd xs:text-bodyXs font-medium">
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
                    </div>

                    <div className="flex flex-col items-center gap-5 flex-wrap w-[860px] wrap:w-[600px] wrapSmall:w-[450px] sm:w-[420px] xs:w-[325px] xs:justify-center">
                        <div className="flex flex-row items-center gap-5 flex-wrap xs:justify-center" ref={exportRef}>
                            {sections.map(item => {
                                return (
                                    <div
                                        key={item.statIndex}
                                        className="flex flex-col gap-5 p-5 w-[420px] xs:w-[300px] xs:justify-center wrap:w-full border-1 border-gray-200 rounded-lg overflow-hidden"
                                    >
                                        <div className="flex flex-row justify-between items-start gap-4">
                                            <div className="flex flex-col">
                                                <div className="flex flex-row gap-1 items-center mb-1">
                                                    <img src={`/images/assets/${item.image}`} alt={item.name} />
                                                    <p className="text-headingXs font-semibold">{item.name}</p>
                                                </div>
                                                <h3 className="text-cyan-1100 text-headingXl xs:text-headingMd mb-4 font-semibold">
                                                    {categoryStats[item.statIndex].authorContributions} publications
                                                    with {item.description}
                                                </h3>
                                                <p className="text-bodySm xs:text-bodyXs">
                                                    You are in the{' '}
                                                    <span className="font-bold">
                                                        {categoryStats[item.statIndex].percentage < 50
                                                            ? 'top'
                                                            : 'bottom'}{' '}
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
                                                <p className="text-bodySm xs:text-bodyXs">
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
                                                                100 -
                                                                categoryStats[item.statIndex].openSciencePercentage
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
                                );
                            })}
                        </div>

                        <div className="flex flex-col gap-3 px-10 sm:px-2 bg-white border-1 border-gray-200 rounded-md w-full">
                            <div className="flex flex-row justify-between items-center">
                                <div className="flex flex-col py-10 xs:max-w-[60%]">
                                    <h1 className="text-heading2Xl smd:text-headingXl sm:text-headingLg xs:text-headingMd font-semibold">
                                        My Annual Resource Sharing
                                    </h1>
                                    <p className="text-bodySm sm:text-bodyXs text-gray-500">
                                        Total publications of yours that share resources
                                    </p>
                                </div>
                                <div className="flex flex-row smd:flex-col gap-4 smd:items-end">
                                    <FilterDropdown
                                        legendItems={legendItems}
                                        activeItems={barActiveLegendItems}
                                        toggleLegendItem={toggleLegendItem}
                                        chartType="bar"
                                        minYear={barMinMaxYear.minYear ?? undefined}
                                        maxYear={barMinMaxYear.maxYear ?? undefined}
                                        yearRange={yearRange ?? undefined}
                                        onYearRangeChange={setYearRange}
                                    />
                                    <ExportDropdown
                                        onDownload={format => downloadChartImage(format as 'png' | 'jpeg', 'bar')}
                                        chartType="bar"
                                    />
                                </div>
                            </div>

                            <div
                                className="chart-container relative w-full"
                                style={{ height: '500px', paddingBottom: '20px' }}
                            >
                                <AnnualChart
                                    ref={barChartRef}
                                    chartData={filteredBarChartData}
                                    activeLegendItems={barActiveLegendItems}
                                />
                            </div>
                        </div>

                        <div
                            className="flex flex-col gap-3 px-10 sm:px-2 bg-white border-1 border-gray-200 rounded-md w-full"
                            id="scatter-plot"
                        >
                            <div className="flex flex-row justify-between items-center">
                                <div className="flex flex-col py-10 xs:max-w-[60%]">
                                    <h1 className="text-heading2Xl smd:text-headingXl sm:text-headingLg xs:text-headingMd font-semibold">
                                        My Resource Sharing Rank
                                    </h1>
                                    <p className="text-bodySm sm:text-bodyXs text-gray-500">
                                        Your resource sharing vs. the institution's resource sharing
                                    </p>
                                </div>
                                <div className="flex flex-row smd:flex-col gap-4 smd:items-end">
                                    <FilterDropdown
                                        legendItems={legendItems}
                                        activeItems={scatterActiveLegendItems}
                                        toggleLegendItem={toggleLegendItem}
                                        chartType="scatter"
                                        minYear={undefined}
                                        maxYear={undefined}
                                        yearRange={undefined}
                                        onYearRangeChange={() => {}}
                                    />
                                    <ExportDropdown
                                        onDownload={format => downloadChartImage(format as 'png' | 'jpeg', 'scatter')}
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

                        {/* <div
                            className="flex flex-col gap-3 px-10 sm:px-2 bg-white border-1 border-gray-200 rounded-md w-full"
                            id="contribution-histogram"
                        >
                            <div className="flex flex-row justify-between items-center">
                                <div className="flex flex-col py-10">
                                    <h1 className="text-heading2Xl sm:text-headingLg font-semibold">
                                        Resource Contribution Distribution
                                    </h1>
                                    <p className="text-bodySm sm:text-bodyXs text-gray-500">
                                        How your resource sharing compares with other scientists
                                    </p>
                                </div>
                                <div className="flex flex-row sm:flex-col gap-4">
                                    <FilterDropdown
                                        legendItems={legendItems}
                                        activeItems={histogramActiveLegendItems}
                                        toggleLegendItem={toggleLegendItem}
                                        chartType="histogram"
                                    />
                                    <ExportDropdown
                                        onDownload={format => downloadChartImage(format as 'png' | 'jpeg', 'histogram')}
                                        chartType="histogram"
                                    />
                                </div>
                            </div>

                            <div className="chart-container relative w-full" style={{ height: '425px' }}>
                                <PersonalHistogram
                                    ref={histogramRef}
                                    chartData={histogramData}
                                    activeLegendItems={histogramActiveLegendItems}
                                />
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
            <Toast ref={toast} baseZIndex={1000} position="bottom-right" />
        </div>
    );
};

export default PiProfile;
