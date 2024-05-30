import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import Pub from '../interfaces/Pub';
import PublicationModalContent from '../components/PublicationModal/PublicationModalContent';

const Publication: React.FC = () => {
    const { doi } = useParams();
    const [pub, setPub] = useState<Pub | null>(null);

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

    return (
        <div className="pt-28 md:px-0 px-[120px]">
            {pub ? <PublicationModalContent pub={pub} /> : <p>Loading publication data...</p>}
        </div>
    );
};

export default Publication;
