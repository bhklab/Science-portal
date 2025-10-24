import React, { useState, useContext } from 'react';
import axios from 'axios';
import { InputText } from 'primereact/inputtext';
import { AuthContext } from '../hooks/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Login: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const login = async () => {
        try {
            const res = await axios.post('/api/auth/login', {
                username,
                password
            });

            if (res.status === 201) {
                const { access_token } = res.data;
                localStorage.setItem('accessToken', access_token);

                // Get user info from web token
                const decodedUser = jwtDecode(access_token);
                authContext?.setUser(decodedUser);

                // Remove error message
                setErrorMessage(null);

                // Navigate to profile upon successful login, unless coming from certain pages
                let redirectPath = '/profile';
                if (
                    location?.state?.from?.pathname === '/admin' ||
                    location?.state?.from?.pathname === '/submit-publication'
                ) {
                    redirectPath = location?.state?.from?.pathname || '/';
                }
                navigate(redirectPath, { replace: true });
            }
        } catch (error) {
            setErrorMessage('Login failed. Please check your credentials.');
            console.error('Error during login:', error);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen">
            <div className="flex flex-col p-10 gap-8 w-[400px] border-1 border-gray-300 rounded-lg bg-white">
                <div className="w-full">
                    <img
                        src="/images/assets/science-portal-logo.svg"
                        alt="Science Portal"
                        className="h-[28px] w-[224px]"
                    />
                </div>
                <div className="flex flex-col gap-1 text-black-900">
                    <h1 className="text-heading2Xl font-semibold">Log in</h1>
                    <p>Use your UHN credentials to use the Science Portal</p>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                        <p className="text-bodyMd text-black-900">Email</p>
                        <div className="flex items-center w-full">
                            <InputText
                                className="pr-3 py-2 rounded border-1 border-gray-300 w-full"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="text-bodyMd text-black-900">Password</p>
                        <div className="flex items-center w-full">
                            <InputText
                                type="password"
                                className="pr-3 py-2 rounded border-1 border-gray-300 w-full"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    <button className="w-full bg-blue-600 rounded-md text-white py-2 font-semibold" onClick={login}>
                        Log in
                    </button>

                    <div className="flex flex-col justify-center items-center gap-2">
                        <p className="text-bodyXs text-gray-600 text-center">
                            Science Portal logins and authentication are managed by a keycloak instance deployed by UHN
                        </p>
                        <div className="flex flex-row justify-center items-center gap-2">
                            <img src="/images/assets/uhn-icon.svg" className="w-16" alt="UHN" />
                            <img src="/images/assets/keycloak-icon.svg" className="w-28" alt="keycloak" />
                        </div>
                    </div>
                </div>
                {errorMessage && <p className="text-red-600">{errorMessage}</p>}
            </div>
        </div>
    );
};

export default Login;
