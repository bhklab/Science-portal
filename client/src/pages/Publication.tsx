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
    );
};

export default Publication;
