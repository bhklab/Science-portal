import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Toast } from 'primereact/toast';

const Unsubscribe: React.FC = () => {
    const [email, setEmail] = useState('');
    const toast = useRef<Toast>(null);

    const unsub = async () => {
        try {
            const mail = await axios.post('/api/mailing/opting', {
                email: email,
                mailOptIn: true
            });
            if (!mail.data) {
                toast.current?.show({
                    severity: 'success',
                    summary: 'Newsletter Removal',
                    detail: `The email ${email} has been removed from the Science Portal mailing list`,
                    life: 8000
                });
            }
        } catch (error) {
            console.error('Error updating mailing preference:', error);
        }
    };

    return (
        <div className="my-24 w-1/2 mx-auto gap-3">
            <label className="text-sm text-gray-600">Your Email</label>
            <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="border-1 border-open_border p-2 rounded w-full mb-2"
            />
            <button
                className={`flex flex-row justify-center items-center px-4 py-2 text-white ${
                    email.includes('@') &&
                    (email.includes('uhn.ca') ||
                        email.includes('utoronto.ca') ||
                        email.includes('SinaiHealthSystem.ca') ||
                        email.includes('wchospital.ca'))
                        ? 'bg-blue-1000'
                        : 'bg-gray-200'
                } rounded-md shadow-sm w-32`}
                onClick={unsub}
                disabled={
                    !(
                        email.includes('@') &&
                        (email.includes('uhn.ca') ||
                            email.includes('utoronto.ca') ||
                            email.includes('SinaiHealthSystem.ca') ||
                            email.includes('wchospital.ca'))
                    )
                }
            >
                Unsubscribe
            </button>
            <Toast ref={toast} baseZIndex={1000} position="bottom-right" />
        </div>
    );
};

export default Unsubscribe;
