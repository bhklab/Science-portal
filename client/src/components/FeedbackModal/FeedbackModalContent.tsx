import React, { useContext, useState, useRef } from 'react';
import { AuthContext } from '../../hooks/AuthContext';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';

interface FeedbackModalContentProps {
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
    submitFeedback: (subject: string, message: string) => void;
}

const options = [
    {
        name: "I'm experiencing an issue",
        value: "I'm experiencing an issue"
    },
    {
        name: 'I have a suggestion for the website',
        value: 'I have a suggestion for the website'
    },
    {
        name: 'Request a new publication resource',
        value: 'Request a new publication resource'
    },
    {
        name: 'General feedback',
        value: 'General feedback'
    }
];

const FeedbackModalContent: React.FC<FeedbackModalContentProps> = ({ setIsVisible, submitFeedback }) => {
    const authContext = useContext(AuthContext);
    const [selectedOption, setSelectedOption] = useState<string>('');
    const [message, setMessage] = useState<string>('');

    return (
        <div className="flex flex-col gap-4 p-10 text-black-900">
            <div className="flex flex-col">
                <p className="text-bodyMd">Feedback will be sent from the following email:</p>
                <span className="text-blue-1000 text-bodyMd">{authContext?.user.email}</span>
            </div>
            <div className="flex flex-col gap-1">
                <p className="text-bodyMd">Feedback Type</p>
                <Dropdown
                    value={selectedOption}
                    options={options}
                    onChange={e => setSelectedOption(e.value)}
                    optionLabel="name"
                    placeholder="Select..."
                    className={`rounded border-1 border-open_border w-full md:w-40 text-black-900`}
                />
            </div>
            <div className="flex flex-col gap-1">
                <p className="text-bodyMd">Message</p>
                <InputTextarea
                    autoResize
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    rows={5}
                    placeholder="Write feedback..."
                    className={`rounded border-1 border-open_border w-full md:w-40 text-black-900`}
                />
            </div>
            <div className="flex flex-row justify-end gap-4">
                <button
                    className="flex flex-row justify-center items-center px-4 py-2 font-semibold bg-white border-open_border rounded-md shadow-sm"
                    onClick={() => setIsVisible(false)}
                >
                    Cancel
                </button>
                <button
                    disabled={selectedOption && message ? false : true}
                    className={`flex flex-row justify-center items-center px-4 py-2 text-white ${selectedOption && message ? 'bg-blue-1000' : 'bg-gray-200'} rounded-md shadow-sm`}
                    onClick={() => submitFeedback(selectedOption, message)}
                >
                    Send Feedback
                </button>
            </div>
        </div>
    );
};

export default FeedbackModalContent;
