import React, { useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Messages } from 'primereact/messages';

interface ModalContentProps {
    selectedAuthor: any;
    setEmail: (email: string) => void;
    handleLogin: () => void;
    isSubmitting: boolean;
    email: string;
    onHide: () => void;
}

const EmailModalContent: React.FC<ModalContentProps> = ({ selectedAuthor, setEmail, handleLogin, isSubmitting, email, onHide }) => {
    const messages = useRef<Messages>(null);
    return (
        <div className="flex flex-col justify-center items-center gap-5">
            <div className="flex flex-col gap-1 w-full">
                <div className="flex justify-between items-center">
                    <h2 className="text-headingLg text-black-900 text-left">{`Hello ${selectedAuthor?.firstName}, please enter your institution email so we can verify it's you`}</h2>
                    <button
                        className="p-[10px] rounded-[4px] hover:bg-gray-100 text-right"
                        onClick={onHide}
                    >
                        <img
                            src="/images/assets/close-modal-icon.svg"
                            alt="close publication modal icon"
                            className="w-6"
                        />
                    </button>
                </div>
                <p className="text-bodySm text-red-800 w-full text-left">
                    Note: You will recieve a one time code to your institution email to temporarily view your
                    personal science portal analytics
                </p>
            </div>
            <InputText
                placeholder="ex. firstname.lastname@uhn.ca"
                className="pr-3 py-2 rounded border-1 border-gray-300 w-full"
                onChange={e => setEmail(e.target.value)}
            />
            <div className="flex flex-row justify-start w-full">
                {email && (
                    <Button
                        label={isSubmitting ? '' : 'Send code'}
                        icon={isSubmitting ? 'pi pi-spin pi-spinner' : 'pi pi-arrow-left'}
                        className="w-32 p-2 border-2 transition ease-out delay-150 hover:-translate-y-0.5 hover:scale-110 hover:text-bold duration-200"
                        onClick={handleLogin}
                    />
                )}
            </div>
            <Messages ref={messages} />
        </div>
    );
};

export default EmailModalContent;
