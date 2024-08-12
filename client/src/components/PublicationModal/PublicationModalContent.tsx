import React, { useEffect, useRef, useState } from 'react';
import Pub from '../../interfaces/Pub';
import { PublicationImage } from '../PublicationImage/PublicationImage';
import { Tooltip } from 'primereact/tooltip';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Messages } from 'primereact/messages';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
        
        

const PublicationModalContent: React.FC<{ pub: Pub }> = ({ pub }) => {
    const code = ['github', 'gitlab'];
    const data = [
        'geo',
        'dbGap',
        'kaggle',
        'dryad',
        'empiar',
        'gigaDB',
        'zenodo',
        'ega',
        'xlsx',
        'csv',
        'proteinDataBank',
        'dataverse',
        'openScienceframework',
        'finngenGitbook',
        'gtexPortal',
        'ebiAcUk',
        'mendeley'
    ];
    const containers = ['codeOcean', 'colab'];
    const results = ['gsea', 'figshare'];
    const trials = ['clinicalTrial'];
    const miscellanous = ['IEEE', 'pdf', 'docx', 'zip'];
    const supplementary = pub.supplementary as { [key: string]: string | undefined };
    const supplementaryKeys = Object.keys(supplementary);
    const codeLinks = supplementaryKeys.filter(key => code.includes(key) && supplementary[key]);
    const dataLinks = supplementaryKeys.filter(key => data.includes(key) && supplementary[key]);
    const containerLinks = supplementaryKeys.filter(key => containers.includes(key) && supplementary[key]);
    const resultLinks = supplementaryKeys.filter(key => results.includes(key) && supplementary[key]);
    const trialLinks = supplementaryKeys.filter(key => trials.includes(key) && supplementary[key]);
    const miscellanousLinks = supplementaryKeys.filter(key => miscellanous.includes(key) && supplementary[key]);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    


    const renderLinkSection = (title: string, links: string[]) => (
        <div className="flex flex-col gap-5">
            <h1 className="text-headingXl text-black-900 font-semibold">{title}</h1>
            {links.map(link => {
                const urls = (supplementary[link] || '').split(',').map(url => url.trim());
                return (
                    <div
                        key={link}
                        className="flex flex-col gap-3 rounded-[4px] p-5 bg-gray-50 border-1 border-gray-200 hover:bg-gray-100"
                    >
                        <div className="flex flex-row">
                            <p className="w-full capitalize">{link}</p>
                        </div>

                        {urls.map((url, index) => (
                            <a
                                key={index}
                                href={url}
                                target="_blank"
                                rel="noreferrer"
                                className="flex flex-row gap-2 items-center mt-2 hover:text-blue-500"
                            >
                                <img
                                    src={`/images/assets/${link.toLowerCase()}-icon.png`}
                                    alt={link}
                                    className="h-6 w-6"
                                />
                                <p className="text-bodyMd mmd:text-bodySm break-all">{url}</p>
                                {/* <img src="/images/assets/goto-link-icon.svg" alt="Go to link" className="h-5 w-5" /> */}
                            </a>
                        ))}
                    </div>
                );
            })}
        </div>
    );

    const handleAddInfo = () => {
        setIsModalVisible(true);
    };

    const [selectedDataType, setSelectedDataType] = useState<Array<'github' | 'codeocean'>>([]);
    const [inputs, setInputs] = useState<Array<{ type: string, value: string }>>([]);

    const handleAddInput = () => {
        if (selectedDataType && selectedDataType.length > 0) {
            const newInputs = selectedDataType.map(type => ({ type, value: '' }));
            setInputs([...inputs, ...newInputs]);
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

    const [isAddDataClicked, setIsAddDataClicked] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const inputTypes = [
        { label: 'GitHub', value: 'GitHub' },
        { label: 'CodeOcean', value: 'codeOcean' },
        { label: 'geo', value: 'geo' },
        { label: 'dbGap', value: 'dbGap' },
        { label: 'figshare', value: 'figshare' },
        { label: 'kaggle', value: 'kaggle' },
        { label: 'dryad', value: 'dryad' },
        { label: 'empiar', value: 'empiar' },
        { label: 'gigaDb', value: 'gigaDb' },
        { label: 'dataverse', value: 'dataverse' },
        { label: 'IEEE', value: 'IEEE' },
        { label: 'mendeley', value: 'mendeley' },
        { label: 'openScienceframework', value: 'openScienceframework' },
        { label: 'zenodo', value: 'zenodo' },
        { label: 'gitlab', value: 'gitlab' },
        { label: 'finngenGitbook', value: 'finngenGitbook' },
        { label: 'pdf', value: 'pdf' },
        { label: 'docx', value: 'docx' },
        { label: 'clinicalTrial', value: 'clinicalTrial' },
        { label: 'ega', value: 'ega' },
        { label: 'zip', value: 'zip' },
        { label: 'xlsx', value: 'xlsx' },
        { label: 'csv', value: 'csv' },
        { label: 'gtexPortal', value: 'gtexPortal' },
        { label: 'proteinDataBank', value: 'proteinDataBank' },
        { label: 'ebiAcUk', value: 'ebiAcUk' },
        { label: 'gsea', value: 'gsea' },
    ];

    return (
        <div className="flex flex-col gap-10 py-10 mmd:px-[10px] px-[120px]">
            <div className="flex flex-col gap-5 pb-10 border-b-2 border-gray-200 mmd:justify-center mmd:items-center ">
            <div className="flex justify-between">
                <div className="h-48 w-48 md:h-[120px] md:w-[120px] overflow-hidden border-2 border-gray-200 rounded-lg flex justify-center items-center bg-white">
                    <PublicationImage image={pub.image} />
                </div>
                <div className="flex items-center">
                <Tooltip target=".info-icon" />
                    <i 
                    className="info-icon pi pi-flag p-[10px] rounded-[4px] hover:bg-gray-100 text-red-800" 
                    data-pr-tooltip="Add missing information"
                    data-pr-position="top"
                    onClick={handleAddInfo}
                    style={{ fontSize: '2.0rem' }}>
                    </i>
                </div>
            </div>
            <Dialog
                visible={isModalVisible}
                onHide={() => setIsModalVisible(false)}
                onClick={e => e.stopPropagation()}
                style={{ width: '700px', borderRadius: '15px', height: '600px' }}
                modal
                draggable={false}
                position="bottom"
                closable={false}
            >
                <div className="flex flex-col justify-center items-center gap-5">
                    <div className="flex flex-col gap-1 w-full">
                        <div className="flex justify-between items-center">
                            <h2 className="text-headingLg text-black-900 text-left">Please select the supplementary data you wish to contribute</h2>
                            <button
                                className="p-[10px] rounded-[4px] hover:bg-gray-100 text-right"
                                onClick={() => {
                                    setIsModalVisible(false);
                                    resetFields();
                                    }}
                            >
                                <img
                                    src="/images/assets/close-modal-icon.svg"
                                    alt="close publication modal icon"
                                    className="w-6"
                                />
                            </button>
                        </div>
                        <p className="text-bodySm text-red-800 w-full text-left">
                            Note: A request will be sent to the Science Portal team. You will be notified regarding the outcome of your request.
                        </p>
                    </div>
                    <MultiSelect
                        value={selectedDataType} 
                        options={inputTypes} 
                        onChange={e => setSelectedDataType(e.value)} 
                        placeholder="Select Data Type" 
                        className="text-gray-700 w-full text-left border-2 border-visible"
                        itemTemplate={(option) => <span  className="text-gray-700">{option.label}</span>}
                    />
                    
                    {selectedDataType && selectedDataType.length > 0 ? (
                        <Button 
                            onClick={handleAddInput} 
                            label='Add Data' 
                            className='w-32 p-2 border-2 w-full text-left'
                        />
                    ) : null}
                    
                    {inputs.map((input, index) => (
                    <div key={index}>
                        <InputText 
                            placeholder={`${input.type}`} 
                            value={input.value} 
                            onChange={e => handleInputChange(index, e.target.value)} 
                            className="mr-4"
                        />
                        <i className="pi pi-trash p-[10px] rounded-[4px] hover:bg-gray-100" style={{ fontSize: '1.3rem' }} onClick={() => handleDeleteInput(index)}></i>
                    </div>
                    ))}
                    
                    <div className="flex flex-row justify-start w-full">
                        {isAddDataClicked && selectedDataType && inputs.every(input => input.value.trim() !== '') && (
                            <Button
                                label={isSubmitting ? '' : 'Submit'}
                                icon={isSubmitting ? 'pi pi-spin pi-spinner' : 'pi pi-arrow-left'}
                                className="w-32 p-2 border-2 transition ease-out delay-150 hover:-translate-y-0.5 hover:scale-110 hover:text-bold duration-200"
                                disabled={!selectedDataType}
                            />
                        )}
                    </div>
                </div>
            </Dialog>
                <div className="flex flex-col gap-2">
                    <h1 className="md:text-headingMd text-heading2Xl font-semibold text-cyan-900 mmd:text-center">
                        {pub.name}
                    </h1>
                    <p className="md:text-bodySm mmd:text-center font-light">{pub.authors}</p>
                    <div className="flex mmd:flex-col flex-row gap-2 mmd:gap-0 text-bodyMd md:text-bodySm text-gray-700 font-light mmd:text-center">
                        <p>{pub.journal}</p>
                        <p className="mmd:hidden">•</p>
                        <p>{pub.date}</p>
                        <p className="mmd:hidden">•</p>
                        <p>{pub.citations} citations</p>
                    </div>
                </div>
                <div className="flex flex-col gap-3 rounded-[4px] p-5 bg-gray-50 border-1 border-gray-200 w-full hover:bg-gray-100 hover:text-gray">
                    <div className="flex flex-row">
                        <p className="w-full">Digital Object Identifier</p>
                    </div>
                    <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noreferrer">
                        <div className="flex flex-row gap-2 items-center hover:text-blue-500">
                            <img src="/images/assets/doi-icon.svg" alt="Doi" className="h-6 w-6" />
                            <p className="text-bodyMd mmd:text-bodySm break-all">https://doi.org/{pub.doi}</p>
                            {/* <img src="/images/assets/goto-link-icon.svg" alt="Go to link" className="h-5 w-5" /> */}
                        </div>
                    </a>
                </div>
            </div>
            {/* <div className="flex items-center">
                    <i className="pi pi-flag p-[10px] rounded-[4px] hover:bg-gray-100 text-red-800" style={{ fontSize: '2.0rem' }}></i>
                    <p className="text-bodySm text-red-800 ml-4">
                        Add missing information
                    </p>
            </div> */}
            {codeLinks.length > 0 && renderLinkSection('Code', codeLinks)}
            {dataLinks.length > 0 && renderLinkSection('Data', dataLinks)}
            {containerLinks.length > 0 && renderLinkSection('Containers', containerLinks)}
            {trialLinks.length > 0 && renderLinkSection('Trials', trialLinks)}
            {resultLinks.length > 0 && renderLinkSection('Results', resultLinks)}
            {miscellanousLinks.length > 0 && renderLinkSection('Miscellanous', miscellanousLinks)}
        </div>
    );
};

export default PublicationModalContent;
