import React from 'react';
import { Dialog } from 'primereact/dialog';
import EmailModalContent from './EmailModalContent';

interface ReusableModalProps {
    isVisible: boolean;
    onHide: () => void;
    selectedAuthor: any;
    setEmail: (email: string) => void;
    handleLogin: () => void;
    isSubmitting: boolean;
    email: string;
}

const EmailModal: React.FC<ReusableModalProps> = ({ isVisible, onHide, selectedAuthor, setEmail, handleLogin, isSubmitting, email }) => {
    return (
        <Dialog
            visible={isVisible}
            onHide={onHide}
            onClick={e => e.stopPropagation()}
            style={{ width: '700px', borderRadius: '15px', height: '350px' }}
            modal
            draggable={false}
            position="bottom"
            closable={false}
        >
            <EmailModalContent 
                selectedAuthor={selectedAuthor} 
                setEmail={setEmail} 
                handleLogin={handleLogin} 
                isSubmitting={isSubmitting} 
                email={email} 
                onHide={onHide} 
            />
        </Dialog>
    );
};

export default EmailModal;
