import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export const Navbar: React.FC = () => {
    const location = useLocation();
    return (
        <div className="flex items-center fixed top-0 z-20 w-full h-16 bg-white border-b-1 border-gray-200">
            <div className="flex flex-row items-center gap-10 absolute left-0 pl-16 md:pl-1 h-16">
                <Link to="/" className="duration-300 ease-in-out hover:cursor-pointer">
                    <img
                        src="/images/assets/new-science-portal-logo.svg"
                        alt="science portal logo"
                        className="h-[40px] w-[220px]"
                    />
                </Link>
                <div className="flex h-full justify-center align-center">
                    <Link
                        to="/"
                        className={`flex flex-col p-2.5 justify-center align-center text-center ${location.pathname === '/' ? 'font-bold border-b-2 border-black-900' : 'text-gray-700 font-light'} `}
                    >
                        Explore
                    </Link>

                    <Link
                        to="/analytics"
                        className={`flex flex-col p-2.5 justify-center align-center text-center ${location.pathname === '/analytics' ? 'font-bold border-b-2 border-black-900' : 'text-gray-700 font-light'} `}
                    >
                        Analytics
                    </Link>
                </div>
            </div>
        </div>
    );
};
