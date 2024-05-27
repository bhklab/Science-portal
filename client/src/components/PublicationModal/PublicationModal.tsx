import React, { useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import Pub from '../../interfaces/Pub';
import PublicationModalContent from './PublicationModalContent';

interface ReusableModalProps {
    isVisible: boolean;
    onHide: () => void;
    pub: Pub | null;
}

const ReusableModal: React.FC<ReusableModalProps> = ({ isVisible, onHide, pub }) => {
    const toast = useRef<Toast>(null);

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
            navigator.clipboard
                .writeText(url)
                .then(() => {
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'DOI link copied to clipboard',
                        life: 3000
                    });
                })
                .catch(err => {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to copy DOI link',
                        life: 3000
                    });
                    console.error('Failed to copy DOI link', err);
                });
        }
    };

    const modalHeader = () => (
        <div className="flex flex-row justify-between items-center align-middle">
            <button className="p-[10px] rounded-[4px] hover:bg-gray-100" onClick={handleExpandClick}>
                <img src="/images/assets/expand-modal-icon.svg" alt="expand publication modal button" className="w-6" />
            </button>
            <div className="flex flex-row items-center gap-2">
                <button className="p-[10px] rounded-[4px] hover:bg-gray-100" onClick={handleCopyDoi}>
                    <img src="/images/assets/copy-doi-icon.svg" alt="copy doi button" className="w-6" />
                </button>
                <button className="p-[10px] rounded-[4px] hover:bg-gray-100" onClick={onHide}>
                    <img src="/images/assets/close-modal-icon.svg" alt="close publication modal icon" className="w-6" />
                </button>
            </div>
        </div>
    );

    return (
        <>
            <Toast ref={toast} className="fixed z-50 top-10 right-4" />
            <Dialog
                visible={isVisible}
                header={modalHeader}
                onHide={onHide}
                style={{ width: '50vw', borderRadius: '15px' }}
                modal
                draggable={false}
                closable={false}
                position="bottom"
            >
                {pub && <PublicationModalContent pub={pub} />}
            </Dialog>
        </>
    );
};

export default ReusableModal;
