import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Pub from '../interfaces/Pub';

const PiProfile: React.FC = () => {
    return (
        <div className="py-28 smd:px-4 px-[120px] min-h-screen flex flex-col gap-4">
            <div className="flex flex-col gap-3 w-full mb-8">
                <div className="flex flex-row gap-3 items-baseline">
                    <h1 className="text-heading2Xl font-extrabold">Benjamin Haibe-Kains</h1>
                    <h2 className="text-headingLg font-semibold">Senior Scientist</h2>
                </div>
                <div className="flex flex-row gap-2">
                    <h3 className="text-headingMd font-semibold">Primary research institute:</h3>
                    <h3 className="text-headingMd">Princess Margaret</h3>
                </div>
                <div className="flex flex-row gap-2">
                    <h3 className="text-headingMd font-semibold">Email:</h3>
                    <h3 className="text-headingMd">benjamin.haibe-kains@uhn.ca</h3>
                </div>
            </div>
            <p className="text-bodySm font-semibold text-red-700">
                Note: Only considering publications from 2022 onward within PM
            </p>
            <div className="flex flex-col justify-center items-center gap-8 bg-white rounded-lg p-8 smd:p-3 shadow-lg w-fit border-1 border-gray-200">
                <div className="flex flex-row items-center smd:justify-center gap-8 flex-wrap">
                    <div className="w-[300px] text-center">
                        <h2 className="text-headingLg font-bold text-cyan-1000 mb-1">Total Publications</h2>
                        <h3 className="text-headingSm font-semibold mb-4">44 publications</h3>
                        <p className="text-bodySm">
                            You are in the top 1% of released publications within Princess Margaret
                        </p>
                    </div>
                    <div className="w-[300px] text-center">
                        <h2 className="text-headingLg font-bold text-cyan-1000 mb-1">Total Citations</h2>
                        <h3 className="text-headingSm font-semibold mb-4">500 citations</h3>
                        <p className="text-bodySm">You are in the top 5% of publications within Princess Margaret</p>
                    </div>
                </div>
            </div>
            <div className="flex flex-row bg-white rounded-lg shadow-lg border-1 border-gray-200">
                <div className="w-[300px] text-center border-x-1 border-gray-200 p-8 smd:p-3">
                    <h2 className="text-headingLg font-bold text-cyan-1000 mb-1">Code Sharing</h2>
                    <h3 className="text-headingSm font-semibold mb-4">Shared 500 pieces of code</h3>
                    <p className="text-bodySm">You are in the top 1% of code sharing within your publications</p>
                </div>
                <div className="w-[300px] text-center border-r-1 border-gray-200 p-8 smd:p-3">
                    <h2 className="text-headingLg font-bold text-cyan-1000 mb-1">Data Sharing</h2>
                    <h3 className="text-headingSm font-semibold mb-4">Shared 500 pieces of data</h3>
                    <p className="text-bodySm">You are in the top 1% of data sharing within your publications</p>
                </div>
                <div className="w-[300px] text-center border-r-1 border-gray-200 p-8 smd:p-3">
                    <h2 className="text-headingLg font-bold text-cyan-1000 mb-1">Container Sharing</h2>
                    <h3 className="text-headingSm font-semibold mb-4">Shared 5 containers</h3>
                    <p className="text-bodySm">You are in the top 1% of container sharing within your publications</p>
                </div>
                <div className="w-[300px] text-center border-r-1 border-gray-200 p-8 smd:p-3">
                    <h2 className="text-headingLg font-bold text-cyan-1000 mb-1">Clinical Trial Sharing</h2>
                    <h3 className="text-headingSm font-semibold mb-4">Shared 10 clinical trials used</h3>
                    <p className="text-bodySm">
                        You are in the top 10% of clinical trial sharing within your publications
                    </p>
                </div>
                <div className="w-[300px] text-center border-r-1 border-gray-200 p-8 smd:p-3">
                    <h2 className="text-headingLg font-bold text-cyan-1000 mb-1">Results Sharing</h2>
                    <h3 className="text-headingSm font-semibold mb-4">Shared 10 results</h3>
                    <p className="text-bodySm">You are in the top 1% of result sharing within your publications</p>
                </div>
            </div>
        </div>
    );
};

export default PiProfile;
