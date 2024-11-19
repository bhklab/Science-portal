import React from 'react';
import FeedbackModalContent from './FeedbackModalContent';
import { Dialog } from 'primereact/dialog';

interface FeedbackModalProps {
    isVisible: boolean;
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
    submitFeedback: (subject: string, message: string) => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isVisible, setIsVisible, submitFeedback }) => {
    return (
        <Dialog
            visible={isVisible}
            onHide={() => setIsVisible(false)}
            style={{ width: '600px', height: '475px', borderRadius: '10px', zIndex: 1000 }}
            modal
            draggable={false}
            closable={false}
            position="bottom"
        >
            <FeedbackModalContent setIsVisible={setIsVisible} submitFeedback={submitFeedback} />
        </Dialog>
    );
};

export default FeedbackModal;
