import React, { useEffect, useState, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import axios from 'axios';
import Pub, { createDefaultPub } from '../interfaces/Pub';
import PublicationModalContent from '../components/PublicationModal/PublicationModalContent';
import Author from 'interfaces/Author';
import { AuthContext } from 'hooks/AuthContext';

interface PublicationModalProps {
    isVisible: boolean;
    onHide: () => void;
    pub: Pub | null;
    scientists: Author[];
}

const Publication: React.FC = () => {
    const { doi } = useParams();
    const [pub, setPub] = useState<Pub>(createDefaultPub());
    const [editMode, setEditMode] = useState<boolean>(false);
    const [scientists, setScientists] = useState<Author[]>([]);
    const [fanoutEmail, setFanoutEmail] = useState<string>('');

    const toast = useRef<Toast>(null);

    const authContext = useContext(AuthContext);

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
        const getFanoutEmail = async () => {
            try {
                const res = await axios.get('/api/emails/fanout');
                setFanoutEmail(res.data);
            } catch (error) {
                console.log(error);
            }
        };
        getPublication();
        getFanoutEmail();
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

    const fanoutApproval = async (verdict: boolean) => {
        setPub({ ...pub, fanout: { request: true, completed: true, verdict: true } });
        const response = await axios.post('/api/emails/fanout/send', { doi: pub.doi, verdict: verdict });

        toast.current?.show({
            severity: 'success',
            summary: 'Successful email fanout',
            detail: response.data,
            life: 8000
        });
    };

    return (
        <div className="bg-white">
            {pub?.fanout?.request && !pub?.fanout?.verdict && fanoutEmail.includes(authContext?.user.email) && (
                <div className="flex flex-col justify-center items-center gap-2 sticky top-16 w-full py-3 bg-gray-100 border-b-1 ">
                    <h2 className="text-bodyXl font-semibold">
                        Would you like to approve the publication fanout request of this publication?
                    </h2>
                    <div className="flex flex-row gap-4">
                        <button
                            className="text-green-600 text-bodyMd font-semibold transition ease-in-out hover:scale-105"
                            onClick={() => fanoutApproval(true)}
                        >
                            Approve
                        </button>
                        <button
                            className="text-red-600 text-bodyMd font-semibold transition ease-in-out hover:scale-105"
                            onClick={() => fanoutApproval(false)}
                        >
                            Reject
                        </button>
                    </div>
                </div>
            )}

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
            <Toast ref={toast} baseZIndex={1000} position="bottom-right" />
        </div>
    );
};

export default Publication;
