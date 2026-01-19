import React, { Dispatch, SetStateAction } from 'react';
import { Dialog } from 'primereact/dialog';
import { NewPub, createDefaultNewPub } from '../../interfaces/NewPub';
import { InputTextarea } from 'primereact/inputtextarea';

interface SubmitModalProps {
    isVisible: boolean;
    onHide: () => void;
    submitPublication: () => void;
    sendDirector: boolean;
    setSendDirector: () => void;
    newPub: NewPub;
    setNewPub: Dispatch<SetStateAction<NewPub>>;
}

const HeaderSection: React.FC<{
    name: string;
    journal: string;
    date: string | null;
    citations: number;
    doi: string;
}> = ({ name, journal, date, citations, doi }) => (
    <div className="flex flex-col gap-5 border-gray-200 mmd:justify-center mmd:items-center">
        <div className="flex flex-col gap-2">
            <h1 className="md:text-headingMd text-heading2Xl font-semibold text-cyan-900 mmd:text-center">{name}</h1>
            <div className="flex mmd:flex-col flex-row gap-2 mmd:gap-0 text-bodyMd md:text-bodySm text-gray-700 font-light mmd:text-center">
                <p>{journal}</p>
                <p className="mmd:hidden">•</p>
                <p>{date}</p>
                <p className="mmd:hidden">•</p>
                <p>{citations} citations</p>
            </div>
        </div>
        <DigitalObjectIdentifier doi={doi} />
    </div>
);

const DigitalObjectIdentifier: React.FC<{ doi: string }> = ({ doi }) => (
    <div className="flex flex-col gap-3 rounded-[4px] p-5 bg-gray-50 border-1 border-gray-200 w-full hover:text-gray">
        <div className="flex flex-row">
            <p className="w-full">Digital Object Identifier</p>
        </div>
        <a href={`https://doi.org/${doi}`} target="_blank" rel="noreferrer">
            <div className="flex flex-row gap-2 items-center hover:text-blue-500">
                <img src="/images/assets/doi-icon.svg" alt="Doi" className="h-6 w-6" />
                <p className="text-bodyMd mmd:text-bodySm break-all">https://doi.org/{doi}</p>
            </div>
        </a>
    </div>
);

const SubmitModal: React.FC<SubmitModalProps> = ({
    isVisible,
    onHide,
    submitPublication,
    sendDirector,
    setSendDirector,
    newPub,
    setNewPub
}) => {
    const modalHeader = () => {
        return (
            <>
                <div className="flex flex-row justify-between items-center align-middle">
                    <div className="flex flex-row items-center gap-2">
                        <button
                            className="p-[10px] rounded-[4px] hover:bg-gray-100"
                            onClick={() => {
                                onHide();
                            }}
                        >
                            <img
                                src="/images/assets/close-modal-icon.svg"
                                alt="close publication modal icon"
                                className="w-6"
                            />
                        </button>
                    </div>
                </div>
            </>
        );
    };

    return (
        <Dialog
            visible={isVisible}
            header={modalHeader}
            onHide={onHide}
            style={{ width: '1100px', borderRadius: '15px', height: '600px' }}
            modal
            draggable={false}
            closable={false}
            position="bottom"
        >
            <div className="flex flex-col justify-center overflow-auto gap-6 w-full px-24">
                <HeaderSection
                    name={newPub.name}
                    citations={newPub.citations}
                    journal={newPub.journal}
                    date={newPub.date}
                    doi={newPub.doi}
                />
                {sendDirector && (
                    <div className="flex flex-col gap-2 w-full">
                        <p className="text-bodyMd">
                            Publication Summary <span className="text-red-600"> *</span>
                        </p>
                        <InputTextarea
                            value={newPub.summary}
                            className="w-full"
                            onChange={e => setNewPub({ ...newPub, summary: e.target.value })}
                            autoResize
                        />
                        <p className="text-bodySm text-gray-700">
                            Give a brief description of the publication for the scientific director's reference{' '}
                            <span className="font-bold">(max: 2 sentences)</span>.
                        </p>
                        <div className="flex flex-row gap-1">
                            <img src="/images/assets/required-icon.svg" alt="" />
                            <p className="text-bodySm text-red-1000">Required Field</p>
                        </div>
                    </div>
                )}

                <div className="flex flex-col justify-center items-start gap-4">
                    <div className="flex flex-row justify-start items-center gap-2 w-full ">
                        <input
                            type="checkbox"
                            checked={sendDirector}
                            onChange={e => setSendDirector()}
                            className="rounded-full text-sp_dark_green border-red-1000"
                        />
                        <span className="text-bodySm">Notify director of new publication</span>
                    </div>
                    <button
                        disabled={
                            sendDirector
                                ? newPub.summary
                                    ? newPub.summary.split('.').length - 1 < 3
                                        ? false
                                        : true
                                    : true
                                : false
                        }
                        className={`flex flex-row justify-center items-center gap-2 px-3 py-2 ${
                            (
                                sendDirector
                                    ? newPub.summary
                                        ? newPub.summary.split('.').length - 1 < 3
                                            ? false
                                            : true
                                        : true
                                    : false
                            )
                                ? 'bg-gray-400'
                                : 'bg-sp_dark_green cursor-pointer'
                        } rounded-lg text-sm font-semibold text-white shadow-xs cursor-pointer w-fit`}
                        onClick={() => submitPublication()}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </Dialog>
    );
};

export default SubmitModal;
