import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    return (
        <div className="flex items-center justify-between fixed top-0 z-20 w-full h-16 bg-white border-b-1 border-gray-200">
            <div
                className="absolute left-0 pl-16 md:pl-1 duration-300 ease-in-out hover:cursor-pointer"
                onClick={() => {
                    navigate('/');
                }}
            >
                <img
                    src="/images/assets/new-science-portal-logo.svg"
                    alt="science portal logo"
                    className="h-[40px] w-[220px]"
                />
            </div>
            <div className="flex flex-1 justify-center md:absolute md:right-4 md:top-5">
                <div className="flex flex-row gap-4">
                    <Link to="/" className={`hover:text-blue-500 ${location.pathname === '/' ? 'text-blue-500' : ''}`}>
                        Explore
                    </Link>
                    <Link
                        to="/analytics"
                        className={`hover:text-blue-500 ${location.pathname === '/analytics' ? 'text-blue-500' : ''}`}
                    >
                        Analytics
                    </Link>
                </div>
            </div>
        </div>
    );
};
