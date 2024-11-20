import React, { useRef, useState, useContext } from 'react';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { Tooltip } from 'primereact/tooltip';
import Pub from '../../interfaces/Pub';
import PublicationModalContent from './PublicationModalContent';
import { AuthContext } from '../../hooks/AuthContext';

interface ReusableModalProps {
    isVisible: boolean;
    onHide: () => void;
    pub: Pub | null;
}

const ReusableModal: React.FC<ReusableModalProps> = ({ isVisible, onHide, pub }) => {
    const toast = useRef<Toast>(null);
    const [editMode, setEditMode] = useState<boolean>(false);
    const authContext = useContext(AuthContext);

    const handleExpandClick = () => {
        if (pub) {
            const encodedDoi = encodeURIComponent(pub.doi);
            window.open(`/publication/${encodedDoi}`, '_blank');
        }
    };

    const handleCopyDoi = () => {
        if (pub) {
            const encodedDoi = encodeURIComponent(pub.doi);
            const url = `${window.location.origin}/publication/${encodedDoi}`;

            //NOTE: navigator.clipboard only works on local host or trusted domain
            navigator.clipboard
                .writeText(url)
                .then(() => {
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Link Copy',
                        detail: 'Publication page URL has been copied to your clipboard',
                        life: 6000
                    });
                })
                .catch(error => {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to copy publication page URL to your clipboard',
                        life: 6000
                    });
                    console.error('Failed to copy Science Portal link', error);
                });
        }
    };

    const modalHeader = () => {
        return (
            <>
                <div className="flex flex-row justify-between items-center align-middle">
                    <button className="p-[10px] rounded-[4px] hover:bg-gray-100" onClick={handleExpandClick}>
                        <img
                            src="/images/assets/expand-modal-icon.svg"
                            alt="expand publication modal button"
                            className="w-6"
                        />
                    </button>
                    <div className="flex flex-row items-center gap-2">
                        <Tooltip target=".adjust-icon" />

                        {!editMode && authContext?.user && (
                            <button
                                className="p-[10px] rounded-[4px] hover:bg-gray-100 adjust-icon"
                                onClick={() => setEditMode(!editMode)}
                                data-pr-tooltip="Edit publication resources"
                                data-pr-position="left"
                            >
                                <img src="/images/assets/edit-icon.svg" style={{ fontSize: '2.0rem' }} />
                            </button>
                        )}

                        <button className="p-[10px] rounded-[4px] hover:bg-gray-100" onClick={handleCopyDoi}>
                            <img src="/images/assets/copy-doi-icon.svg" alt="copy doi button" className="w-6" />
                        </button>
                        <button
                            className="p-[10px] rounded-[4px] hover:bg-gray-100"
                            onClick={() => {
                                onHide();
                                setEditMode(false);
                            }}
                        >
                            <img
                                src="/images/assets/close-modal-icon.svg"
                                alt="close publication modal icon"
                                className="w-6"
                            />
                        </button>
                    </div>
                    <Toast ref={toast} baseZIndex={1000} position="bottom-right" />
                </div>
            </>
        );
    };

    return (
        <div>
            <Dialog
                visible={isVisible}
                header={modalHeader}
                onHide={onHide}
                style={{ width: '1100px', borderRadius: '15px' }}
                modal
                draggable={false}
                closable={false}
                position="bottom"
            >
                {pub && <PublicationModalContent pub={pub} editMode={editMode} setEditMode={setEditMode} />}
            </Dialog>
        </div>
    );
};

export default ReusableModal;
