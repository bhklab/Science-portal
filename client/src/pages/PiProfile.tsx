import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Use params to get ENID from the URL
import { ProgressSpinner } from 'primereact/progressspinner'; // Import ProgressSpinner
import { useMagic } from '../hooks/magicProvider';

const PiProfile: React.FC = () => {
    const { magic } = useMagic();
    const navigate = useNavigate();
    const { enid } = useParams();

    const [piData, setPiData] = useState<any>(null); // State to hold PI data

    // Fetch data from the backend
    useEffect(() => {
        const fetchPiData = async () => {
            try {
                const response = await fetch(`/api/stats/author/${enid}`);
                const data = await response.json();
                setPiData(data);
            } catch (error) {
                console.error('Error fetching PI data:', error);
            }
        };

        if (enid) {
            fetchPiData();
        }
    }, [enid]);

    // Map percentage to pyramid image
    const getPyramidImage = (percentage: number) => {
        if (percentage >= 81 && percentage <= 100) return 'pyramid-5.png';
        if (percentage >= 61 && percentage <= 80) return 'pyramid-4.png';
        if (percentage >= 41 && percentage <= 60) return 'pyramid-3.png';
        if (percentage >= 21 && percentage <= 40) return 'pyramid-2.png';
        return 'pyramid-1.png';
    };

    useEffect(() => {
        const checkLoginTime = () => {
            const loginTime = localStorage.getItem('loginTime');
            if (loginTime) {
                const currentTime = Date.now();
                const oneMinute = 1 * 60 * 100000000;

                if (currentTime - Number(loginTime) > oneMinute) {
                    if (magic) {
                        magic.user.logout().then(() => {
                            navigate('/');
                        });
                    } else {
                        navigate('/');
                    }
                }
            }
        };

        checkLoginTime();

        const intervalId = setInterval(checkLoginTime, 60 * 1000000);

        return () => clearInterval(intervalId);
    }, [magic, navigate]);

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

    // Example structure of `piData` expected from the backend
    const { author, authorEmail, totalPublications, totalCitations, categoryStats } = piData;

    return (
        <div className="py-36 smd:px-4 px-[120px] min-h-screen bg-white">
            <div className="flex flex-row gap-5 justify-center items-start">
                <div className="flex flex-col min-w-[285px]">
                    <div className="flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <div className="h-[120px] w-[120px] rounded-[120px] overflow-clip">
                                <img src="/images/PIs/benjamin-haibe-kains.jpg" alt="PI-image" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 text-black-900">
                            <h2 className="text-heading2Xl font-semibold">{author}</h2>
                            <p className="text-headingMd">Senior Scientist</p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-row gap-2 items-center">
                                <img src="/images/assets/briefcase-icon.svg" alt="briefcase-icon" />
                                <p className="text-bodyMd">Princess Margaret Cancer Centre</p>
                            </div>
                            <div className="flex flex-row gap-2 items-center">
                                <img src="/images/assets/mail-icon.svg" alt="mail-icon" />
                                <p className="text-bodyMd">{authorEmail}</p>
                            </div>
                            <div className="flex flex-row gap-2 items-center">
                                <img src="/images/assets/globe-icon.svg" alt="globe-icon" />
                                <a href="https://bhklab.ca" target="_blank">
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
                </div>

                <div className="flex flex-row gap-5 flex-wrap">
                    {/* Code Section */}
                    <div className="flex flex-row gap-4 p-5 w-[440px] border-2 b-gray-200 rounded-lg">
                        <div className="flex flex-col">
                            <div className="flex flex-row gap-1 items-center mb-1">
                                <img src="/images/assets/code-icon.svg" alt="code icon" />
                                <p className="text-headingXs font-semibold">Code</p>
                            </div>
                            <h3 className="text-cyan-1100 text-headingXl mb-4">
                                {categoryStats.code.authorContributions}/{categoryStats.code.total} Pieces of Code
                            </h3>
                            <p className="text-bodySm">
                                You are in the top {categoryStats.code.percentage}% of code sharing in your
                                publications.
                            </p>
                        </div>
                        <div className="flex items-center justify-center h-[100px] w-[100px] overflow-visible">
                            <img
                                src={`/images/placeholders/${getPyramidImage(categoryStats.code.percentage)}`}
                                alt="pyramids"
                                className="object-contain overflow-visible relative"
                            />
                        </div>
                    </div>

                    {/* Data Section */}
                    <div className="flex flex-row gap-4 p-5 w-[440px] border-2 b-gray-200 rounded-lg">
                        <div className="flex flex-col">
                            <div className="flex flex-row gap-1 items-center mb-1">
                                <img src="/images/assets/data-icon.svg" alt="data icon" />
                                <p className="text-headingXs font-semibold">Data Points</p>
                            </div>
                            <h3 className="text-cyan-1100 text-headingXl mb-4">
                                {categoryStats.data.authorContributions}/{categoryStats.data.total} Data Points
                            </h3>
                            <p className="text-bodySm">
                                You are in the top {categoryStats.data.percentage}% of data point sharing in your
                                publications.
                            </p>
                        </div>
                        <div className="flex items-center justify-center h-[100px] w-[100px] overflow-visible">
                            <img
                                src={`/images/placeholders/${getPyramidImage(categoryStats.data.percentage)}`}
                                alt="pyramids"
                                className="object-contain overflow-visible relative"
                            />
                        </div>
                    </div>

                    {/* Containers Section */}
                    <div className="flex flex-row gap-4 p-5 w-[440px] border-2 b-gray-200 rounded-lg">
                        <div className="flex flex-col">
                            <div className="flex flex-row gap-1 items-center mb-1">
                                <img src="/images/assets/containers-icon.svg" alt="containers icon" />
                                <p className="text-headingXs font-semibold">Containers</p>
                            </div>
                            <h3 className="text-cyan-1100 text-headingXl mb-4">
                                {categoryStats.containers.authorContributions}/{categoryStats.containers.total}{' '}
                                Containers
                            </h3>
                            <p className="text-bodySm">
                                You are in the top {categoryStats.containers.percentage}% of container sharing in your
                                publications.
                            </p>
                        </div>
                        <div className="flex items-center justify-center h-[100px] w-[100px] overflow-visible">
                            <img
                                src={`/images/placeholders/${getPyramidImage(categoryStats.containers.percentage)}`}
                                alt="pyramids"
                                className="object-contain overflow-visible relative"
                            />
                        </div>
                    </div>

                    {/* Clinical Trials Section */}
                    <div className="flex flex-row gap-4 p-5 w-[440px] border-2 b-gray-200 rounded-lg">
                        <div className="flex flex-col">
                            <div className="flex flex-row gap-1 items-center mb-1">
                                <img src="/images/assets/clinicaltrials-icon.svg" alt="clinical trials icon" />
                                <p className="text-headingXs font-semibold">Clinical Trials</p>
                            </div>
                            <h3 className="text-cyan-1100 text-headingXl mb-4">
                                {categoryStats.trials.authorContributions}/{categoryStats.trials.total} Clinical Trials
                            </h3>
                            <p className="text-bodySm">
                                You are in the top {categoryStats.trials.percentage}% of clinical trial sharing in your
                                publications.
                            </p>
                        </div>
                        <div className="flex items-center justify-center h-[100px] w-[100px] overflow-visible">
                            <img
                                src={`/images/placeholders/${getPyramidImage(categoryStats.trials.percentage)}`}
                                alt="pyramids"
                                className="object-contain overflow-visible relative"
                            />
                        </div>
                    </div>

                    {/* Analysis Results Section */}
                    <div className="flex flex-row gap-4 p-5 w-[440px] border-2 b-gray-200 rounded-lg">
                        <div className="flex flex-col">
                            <div className="flex flex-row gap-1 items-center mb-1">
                                <img src="/images/assets/results-icon.svg" alt="results icon" />
                                <p className="text-headingXs font-semibold">Analysis Results</p>
                            </div>
                            <h3 className="text-cyan-1100 text-headingXl mb-4">
                                {categoryStats.results.authorContributions}/{categoryStats.results.total} Analysis
                                Results
                            </h3>
                            <p className="text-bodySm">
                                You are in the top {categoryStats.results.percentage}% of analysis result sharing in
                                your publications.
                            </p>
                        </div>
                        <div className="flex items-center justify-center h-[100px] w-[100px] overflow-visible">
                            <img
                                src={`/images/placeholders/${getPyramidImage(categoryStats.results.percentage)}`}
                                alt="pyramids"
                                className="object-contain overflow-visible relative"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PiProfile;
