import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { InputText } from 'primereact/inputtext';
import { NewPub, createDefaultNewPub } from '../interfaces/NewPub';
import { LINK_CATEGORIES } from '../interfaces/Links';

const SubmitPublication: React.FC = () => {
    const [newPub, setNewPub] = useState<NewPub>(createDefaultNewPub());

    const handleNewPublicationSubmit = async () => {
        try {
            await axios.post('/api/publications/new', newPub);
            setNewPub(createDefaultNewPub());
        } catch (error) {
            console.error('Error submitting new publication:', error);
        }
    };

    return (
        <div className="flex flex-col px-60 py-[100px] gap-10 text-black-900">
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
                <div className="flex flex-col gap-4 w-full">
                    <div className="flex flex-col gap-1">
                        <p className="text-bodyMd">
                            Publication Title <span className="text-red-600"> *</span>
                        </p>
                        <InputText
                            className={`${newPub.name ? '' : 'invalid-box'} w-full`}
                            onChange={e => setNewPub({ ...newPub, name: e.target.value })}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="text-bodyMd">
                            DOI <span className="text-red-600"> *</span>
                        </p>
                        <InputText
                            className={`${newPub.doi ? '' : 'invalid-box'} w-full`}
                            onChange={e => setNewPub({ ...newPub, doi: e.target.value })}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="text-bodyMd">Journal</p>
                        <InputText
                            className="w-full"
                            onChange={e => setNewPub({ ...newPub, journal: e.target.value })}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="text-bodyMd">Type</p>
                        <InputText className="w-full" onChange={e => setNewPub({ ...newPub, type: e.target.value })} />
                        <p className="text-bodySm text-gray-700">
                            Tell us what type of publication this is. An article, review, etc.
                        </p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="text-bodyMd">Authors</p>
                        <InputText
                            className="w-full"
                            onChange={e => setNewPub({ ...newPub, authors: e.target.value })}
                        />
                        <p className="text-bodySm text-gray-700">
                            List co-authors in this format: LastName, FirstName with a semi-colon separating each
                            individual author. Authors tagged here will be able see the data shared in publication on
                            their personal statistics page.
                        </p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="text-bodyMd">Affiliations</p>
                        <InputText
                            className="w-full"
                            onChange={e => setNewPub({ ...newPub, affiliations: e.target.value })}
                        />
                        <p className="text-bodySm text-gray-700">
                            List all affiliations made with this publication, no matter how small.
                        </p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="text-bodyMd">Publisher</p>
                        <InputText
                            className="w-full"
                            onChange={e => setNewPub({ ...newPub, publisher: e.target.value })}
                        />
                    </div>
                </div>
            </div>
            <hr />
        </div>
    );
};

export default SubmitPublication;
