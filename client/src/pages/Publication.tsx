import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Pub from '../interfaces/Pub';
import PublicationModalContent from '../components/PublicationModal/PublicationModalContent';
import { useLocation } from 'react-router-dom';
import AddDataModal from '../components/AddDataModal/AddDataModal';


const Publication: React.FC = () => {
    const { doi } = useParams();
    const [pub, setPub] = useState<Pub | null>(null);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [isAddDataClicked, setIsAddDataClicked] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const inputTypes = [
        { label: 'GitHub', value: 'GitHub' },
        { label: 'CodeOcean', value: 'codeOcean' },
        { label: 'Gene Expression Omnibus (Geo)', value: 'geo' },
        { label: 'Database of Genotypes and Phenotypes (dbGap)', value: 'dbGap' },
        { label: 'Figshare', value: 'figshare' },
        { label: 'Kaggle', value: 'kaggle' },
        { label: 'Dryad', value: 'dryad' },
        { label: 'Empiar', value: 'empiar' },
        { label: 'GigaScience Database (gigaDb)', value: 'gigaDb' },
        { label: 'Dataverse', value: 'dataverse' },
        { label: 'IEEE', value: 'IEEE' },
        { label: 'Mendeley', value: 'mendeley' },
        { label: 'Open Science Framework (OSF)', value: 'openScienceframework' },
        { label: 'Zenodo', value: 'zenodo' },
        { label: 'Gitlab', value: 'gitlab' },
        { label: 'Finngen', value: 'finngenGitbook' },
        { label: 'PDF', value: 'pdf' },
        { label: 'Word Document (docx)', value: 'docx' },
        { label: 'Clinical Trial Gov', value: 'clinicalTrial' },
        { label: 'European Genome-phenome Archive (EGA)', value: 'ega' },
        { label: 'Compressed Folder (zip)', value: 'zip' },
        { label: 'Excel Document (xlsx)', value: 'xlsx' },
        { label: 'Comma Separated Values File (csv)', value: 'csv' },
        { label: 'Genotype-Tissue Expression (GTEx)', value: 'gtexPortal' },
        { label: 'Protein Data Bank (PDB)', value: 'proteinDataBank' },
        { label: 'EMBLs European Bioinformatics Institute', value: 'ebiAcUk' },
        { label: 'Gene Set Enrichment Analysis (GSEA)', value: 'gsea' },
    ];

    const [selectedDataType, setSelectedDataType] = useState<string[]>([]);
    const [inputs, setInputs] = useState<Array<{ type: string, value: string }>>([]);
    const [addedDataTypes, setAddedDataTypes] = useState<string[]>([]);

    const location = useLocation();

    const handleAddInput = () => {
        if (selectedDataType && selectedDataType.length > 0) {
            const newInputs = selectedDataType.map(type => ({ type, value: '' }));
            setInputs([...inputs, ...newInputs]);
            setAddedDataTypes([...addedDataTypes, ...selectedDataType]);
            setSelectedDataType([]);
            setIsAddDataClicked(true);
        }
    };

    const handleInputChange = (index: number, value: string) => {
        const newInputs = [...inputs];
        newInputs[index].value = value;
        setInputs(newInputs);
    };

    const handleDeleteInput = (index: number) => {
        const newInputs = [...inputs];
        newInputs.splice(index, 1);
        setInputs(newInputs);
    };

    const resetFields = () => {
        setIsAddDataClicked(false);
        setSelectedDataType([]);
        setInputs([]);
    };

    
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const shouldOpenModal = queryParams.get('openAddDataModal');
        
        if (shouldOpenModal) {
            setIsModalVisible(true);
            queryParams.delete('openAddDataModal');
            window.history.replaceState({}, '', `${location.pathname}?${queryParams.toString()}`);
        } else {
            setIsModalVisible(false);
        }
    }, [location.search, location.pathname]); 

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

    const handleFlagClick = () => {
        setIsModalVisible(true);
    };

    return (
        <div className="pt-28 md:px-0 px-[120px] bg-white min-h-screen">
            {pub && <PublicationModalContent pub={pub} onFlagClick={handleFlagClick} />}
            {isModalVisible && 
            <AddDataModal
                isModalVisible={isModalVisible}
                setIsModalVisible={setIsModalVisible}
                resetFields={resetFields}
                selectedDataType={selectedDataType}
                setSelectedDataType={setSelectedDataType}
                inputTypes={inputTypes}
                addedDataTypes={addedDataTypes}
                handleAddInput={handleAddInput}
                inputs={inputs}
                handleInputChange={handleInputChange}
                handleDeleteInput={handleDeleteInput}
                isAddDataClicked={isAddDataClicked}
                isSubmitting={isSubmitting}
            />}
        </div>
    );
};

export default Publication;
