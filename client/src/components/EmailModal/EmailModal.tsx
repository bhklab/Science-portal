import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import EmailModalContent from './EmailModalContent';

interface ReusableModalProps {
    isVisible: boolean;
    onHide: () => void;
}

const EmailModal: React.FC<ReusableModalProps> = ({ isVisible, onHide }) => {
    const modalHeader = () => {
        return (
            <>
                <div className="flex flex-row justify-between items-center align-middle">
                    <h3 className="text-headingXl text-cyan-900 text-left font-bold py-4">
                        PM Scientist Personal Analytics
                    </h3>
                    <button className="p-[10px] rounded-[4px] hover:bg-gray-100" onClick={onHide}>
                        <img
                            src="/images/assets/close-modal-icon.svg"
                            alt="close publication modal icon"
                            className="w-6"
                        />
                    </button>
                </div>
            </>
        );
    };
    return (
        <Dialog
            visible={isVisible}
            onHide={onHide}
            onClick={e => e.stopPropagation()}
            style={{ width: '700px', borderRadius: '15px', height: '500px' }}
            modal
            draggable={false}
            position="bottom"
            closable={false}
            header={modalHeader}
        >
            <EmailModalContent onHide={onHide} />
        </Dialog>
    );
};

export default EmailModal;
