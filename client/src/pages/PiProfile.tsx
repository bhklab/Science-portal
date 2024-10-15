import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMagic } from '../hooks/magicProvider';

const PiProfile: React.FC = () => {
    const { magic } = useMagic();
    const navigate = useNavigate();

    const types = [
        {
            name: 'Code',
            total: 524,
            image: 'code-icon.svg',
            pyramid: 'pyramid-1.png',
            text: 'You are the top code snippet sharer on the Science Portal!'
        },
        {
            name: 'Data Points',
            total: 129,
            image: 'data-icon.svg',
            pyramid: 'pyramid-2.png',
            text: 'You are in the top 10% of data point sharing in your publications.'
        },
        {
            name: 'Containers',
            total: 6,
            image: 'containers-icon.svg',
            pyramid: 'pyramid-3.png',
            text: 'You are in the 25th percentile of sharing containers in your publications.'
        },
        {
            name: 'Clinical Trials',
            total: 24,
            image: 'clinicaltrials-icon.svg',
            pyramid: 'pyramid-4.png',
            text: 'You are in the top 80% of clinical trial sharing in your publications.'
        },
        {
            name: 'Analysis Results',
            total: 12,
            image: 'results-icon.svg',
            pyramid: 'pyramid-5.png',
            text: 'You are in the top 10% of analysis results sharing in your publications.'
        }
    ];

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
                            <h2 className="text-heading2Xl font-semibold">Benjamin Haibe-Kains</h2>
                            <p className="text-headingMd">Senior Scientist</p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-row gap-2 items-center">
                                <img src="/images/assets/briefcase-icon.svg" alt="briefcase-icon" />
                                <p className="text-bodyMd">Princess Margaret Cancer Centre</p>
                            </div>
                            <div className="flex flex-row gap-2 items-center">
                                <img src="/images/assets/mail-icon.svg" alt="mail-icon" />
                                <p className="text-bodyMd">benjamin.haibe-kains@uhn.ca</p>
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
                            <h3 className="text-heading3Xl font-semibold">29</h3>
                            <p className="text-bodyMd">Publications</p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <h3 className="text-heading3Xl font-semibold">3102</h3>
                            <p className="text-bodyMd">Citations</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row gap-5 flex-wrap">
                    {types.map(type => (
                        <div className="flex flex-row gap-4 p-5 w-[440px] border-2 b-gray-200 rounded-lg">
                            <div className="flex flex-col">
                                <div className="flex flex-row gap-1 items-center mb-1">
                                    <img src={`/images/assets/${type.image}`} alt="supplementary type icon" />
                                    <p className="text-headingXs font-semibold">{type.name}</p>
                                </div>
                                <h3 className="text-cyan-1100 text-headingXl mb-4">
                                    {type.total} {type.name}
                                </h3>
                                <p className="text-bodySm">{type.text}</p>
                            </div>
                            <div className="flex items-center justify-center h-[100px] w-[100px] overflow-visible">
                                <img
                                    src={`/images/placeholders/${type.pyramid}`}
                                    alt="pyramids"
                                    className="object-contain overflow-visible relative"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PiProfile;
