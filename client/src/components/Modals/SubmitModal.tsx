import React, { Dispatch, SetStateAction } from 'react';
import { Dialog } from 'primereact/dialog';
import Pub from '../../interfaces/Pub';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputSwitch } from 'primereact/inputswitch';
import { classNames } from 'primereact/utils';
import PublicationModalContent from './PublicationModalContent';

interface SubmitModalProps {
    isVisible: boolean;
    onHide: () => void;
    submitPublication: () => void;
    sendDirector: boolean;
    setSendDirector: () => void;
    newPub: Pub;
    setNewPub: (pub: Pub) => void;
}

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
            style={{ width: '1100px', borderRadius: '15px' }}
            modal
            draggable={false}
            closable={false}
            position="bottom"
            pt={{
                root: () => ({
                    className: classNames('max-h-[90%]')
                })
            }}
        >
            <div className="flex flex-col justify-between overflow-auto h-full w-full px-[120px] mmd:px-[10px] pb-16 gap-4">
                <div className="flex flex-col justify-between gap-6">
                    <PublicationModalContent
                        pub={newPub}
                        editMode={false}
                        setEditMode={() => null}
                        scientists={[]}
                        authContext={null}
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
                </div>

                <div className="flex flex-col gap-3">
                    <div className="flex flex-row items-center gap-2">
                        <InputSwitch
                            checked={sendDirector}
                            onClick={() => setSendDirector()}
                            pt={{
                                root: () => ({
                                    className: classNames('w-10 h-5')
                                }),
                                slider: options => ({
                                    className: classNames(
                                        'before:w-4 before:h-4 before:top-3 before:left-0.5 before:-mt-2.5',
                                        {
                                            'bg-green-600': options?.props.checked,
                                            'bg-red-600': !options?.props.checked
                                        }
                                    )
                                })
                            }}
                        />
                        <p className="text-bodySm font-semibold text-black-900">Notify director</p>
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
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-sp_dark_green cursor-pointer'
                        } rounded-lg text-sm font-semibold text-white shadow-xs w-fit`}
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
