import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { ProgressSpinner } from 'primereact/progressspinner';

const SubmitPublication: React.FC = () => {
    return (
        <div className="flex flex-col px-48 py-[100px] gap-10 text-black-900">
            <h1 className="w-full text-heading2Xl font-semibold">Submit a Publication</h1>
            <hr />
            <div className="flex items-start self-stretch gap-5">
                <div className="flex flex-col items-start gap-2">
                    <h2 className="text-headingXl font-semibold">Publication Details</h2>
                    <p className="text-bodyMd">
                        Include all relevant information for your publication. We are only accepting articles that are
                        published after 2017.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SubmitPublication;
