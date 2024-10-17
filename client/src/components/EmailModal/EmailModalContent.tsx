import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { InputText } from 'primereact/inputtext';
import { useMagic } from '../../hooks/magicProvider';
import axios from 'axios';
import { Dropdown } from 'primereact/dropdown';
import { Messages } from 'primereact/messages';

interface ModalContentProps {
    onHide: () => void;
}

const EmailModalContent: React.FC<ModalContentProps> = ({ onHide }) => {
    const { magic } = useMagic();
    const navigate = useNavigate();

    // Author states
    const [selectedAuthor, setSelectedAuthor] = useState<Lab | null>(null);
    const [authors, setAuthors] = useState<Lab[]>([]);

    // Email states
    const [email, setEmail] = useState<string>('');
    const [emails, setEmails] = useState<string[]>([]);
    const [emailToEnid, setEmailToEnid] = useState<{ [email: string]: string }>({});

    // submit state
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Second part of modal toggle
    const [sectionToggle, setSectionToggle] = useState(false);

    // Initialize messages PrimeReact component
    const messages = useRef<Messages>(null);

    interface Lab {
        name: string;
        firstName: string;
        lastName: string;
    }

    interface Author {
        firstName: string;
        lastName: string;
        email: string;
        primaryAppointment: string;
        primaryResearchInstitute: string;
        secondaryAppointment: string | null;
        secondaryResearchInstitute: string | null;
        ENID: number;
    }

    useEffect(() => {
        const getEmails = async () => {
            try {
                const res = await axios.get(`/api/emails/all`);
                setEmails(res.data);
                console.log(res.data);
            } catch (error) {
                console.error(`Failed to fetch emails: ${error}`);
            }
        };
        getEmails();
    }, []);

    useEffect(() => {
        const getAuthors = async () => {
            try {
                const res = await axios.get(`/api/authors/all`);
                const emailToEnid = res.data.reduce((map: { [email: string]: string }, author: Author) => {
                    map[author.email] = author.ENID.toString();
                    return map;
                }, {});

                setEmailToEnid(emailToEnid);

                setAuthors(
                    res.data.map((aut: Author) => ({
                        name: `${aut.lastName}, ${aut.firstName}`,
                        firstName: `${aut.firstName}`,
                        lastName: `${aut.lastName}`
                    }))
                );
                console.log(res.data);
            } catch (error) {
                console.log(error);
            }
        };
        getAuthors();
    }, []);

    const handleLogin = async () => {
        if (email && magic) {
            if (emails.includes(email)) {
                setIsSubmitting(true);
                await login(email, true);
                setIsSubmitting(false);
            } else {
                messages.current?.show({
                    severity: 'error',
                    summary: 'Incorrect Email Error:',
                    detail:
                        `The email you have entered (${email}) does not match the email stored in the ` +
                        `database for ${selectedAuthor?.firstName} ${selectedAuthor?.lastName}. If this is ` +
                        `incorrect, please reach out to the Science Portal team to correct this issue.`,
                    sticky: true
                });
            }
        } else {
            console.error('Email is required or Magic is not initialized');
        }
    };

    const login = async (emailAddress: string, showUI: boolean) => {
        try {
            if (magic) {
                if (await magic.user.isLoggedIn()) {
                    await magic.user.logout();
                }
                const did = await magic.auth.loginWithEmailOTP({ email: emailAddress, showUI });
                console.log(`DID Token: ${did}`);

                const enid = emailToEnid[emailAddress];
                const userInfo = await magic.user.getInfo();
                console.log(`UserInfo: ${userInfo}`);
                localStorage.setItem('loginTime', Date.now().toString());
                navigate(`/pi-profile/${enid}`);
                await magic.user.logout();
                setEmail('');
            }
        } catch (error) {
            console.error('Login failed', error);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center gap-5 px-5">
            <div className="flex flex-col gap-4 w-full">
                <div className="flex flex-col gap-2">
                    <p className="text-headingMd w-full text-left">
                        View your platform analytics by selecting your name in the dropdown below
                    </p>
                    <p className="text-bodyXs text-red-800 w-full text-left">
                        NOTE: You can only view your own analytics! You will recieve a one time code to your institution
                        email that you must enter here to be granted temporary access to your Science Portal statistics.
                    </p>
                </div>
                {authors && (
                    <Dropdown
                        value={selectedAuthor}
                        options={authors}
                        optionLabel="name"
                        placeholder="Select your name"
                        className="rounded border-1 border-gray-300 w-64 text-black-900"
                        onChange={e => {
                            e.originalEvent?.stopPropagation();
                            setSelectedAuthor(e.value);
                        }}
                        filter
                        showClear
                        filterBy="name"
                    />
                )}
            </div>

            {selectedAuthor != null && (
                <div className="flex flex-col gap-3 w-full">
                    <div className="flex justify-between items-center">
                        <h2 className="text-headingMd  text-left">{`Hello ${selectedAuthor?.firstName}, please enter your institution email below so we can verify it's you.`}</h2>
                    </div>
                    <InputText
                        placeholder="ex. firstname.lastname@uhn.ca"
                        className="pr-3 py-2 rounded border-1 border-gray-300 w-full mb-2"
                        onChange={e => setEmail(e.target.value)}
                    />
                    <div className="flex flex-row justify-center w-full">
                        {email.includes('@') && (
                            <button
                                className="text-blue-600 transition ease-out delay-150 hover:text-blue-800 hover:text-bold duration-200"
                                onClick={handleLogin}
                            >
                                Send code
                            </button>
                        )}
                    </div>
                </div>
            )}
            <Messages ref={messages} />
        </div>
    );
};

export default EmailModalContent;
