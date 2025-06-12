import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Pub from '../interfaces/Pub';
import PublicationModalContent from '../components/PublicationModal/PublicationModalContent';
import Author from 'interfaces/Author';

interface PublicationModalProps {
    isVisible: boolean;
    onHide: () => void;
    pub: Pub | null;
    scientists: Author[];
}

const Publication: React.FC = () => {
    const { doi } = useParams();
    const [pub, setPub] = useState<Pub | null>(null);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [scientists, setScientists] = useState<Author[]>([]);

    useEffect(() => {
        //Fetch publication based on DOI in the URL
        const getPublication = async () => {
            if (doi) {
                try {
                    const encodedDoi = encodeURIComponent(doi);
                    const res = await axios.get(`/api/publications/${encodedDoi}`, { timeout: 10000 });
                    setPub(res.data);
                } catch (error) {
                    console.log(error);
                }
            }
        };
        getPublication();
    }, [doi]);

    // Fetch authors on load
    useEffect(() => {
        const getScientists = async () => {
            try {
                const res = await axios.get(`/api/authors/all`);
                setScientists(
                    res.data.map((scientist: Author) => ({
                        ...scientist,
                        fullName: `${scientist.lastName}, ${scientist.firstName}`
                    }))
                );
            } catch (error) {
                console.log(error);
            }
        };
        getScientists();
    }, []);

    return (
        <div className="bg-white">
            <div className="flex flex-col justify-center items-center gap-2 sticky top-16 w-full py-3 bg-gray-100 border-b-1 ">
                <h2 className="text-bodyXl font-semibold">
                    Would you like to approve the publication fanout request of this publication?
                </h2>
                <div className="flex flex-row gap-4">
                    <button className="text-green-600 text-bodyMd font-semibold transition ease-in-out hover:scale-105">
                        Approve
                    </button>
                    <button className="text-red-600 text-bodyMd font-semibold transition ease-in-out hover:scale-105">
                        Reject
                    </button>
                </div>
            </div>
            <div className="pt-28 md:px-0 px-[120px] bg-white min-h-screen">
                {pub && (
                    <PublicationModalContent
                        pub={pub}
                        editMode={editMode}
                        setEditMode={setEditMode}
                        scientists={scientists}
                    />
                )}
            </div>
        </div>
    );
};

export default Publication;
