import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ProfileDropdown } from '../DropdownButtons/ProfileDropdown';
import { AuthContext } from '../../hooks/AuthContext';

export const Navbar: React.FC = () => {
    const location = useLocation();
    const authContext = useContext(AuthContext);

    return (
        <div className="flex justify-between fixed top-0 z-20 w-full h-16 bg-white border-b-1 border-gray-200">
            <div className="flex flex-row items-center absolute left-0 pl-16 md:pl-1 h-16">
                <Link to="/" className="duration-300 ease-in-out hover:cursor-pointer mr-4">
                    <img
                        src="/images/assets/science-portal-logo.svg"
                        alt="science portal logo"
                        className="h-[40px] w-[220px]"
                    />
                </Link>
                <div className="flex h-full justify-center align-center">
                    <Link
                        to="/"
                        className={`flex flex-col p-2.5 justify-center align-center text-center ${
                            location.pathname === '/'
                                ? 'font-bold border-b-2 border-black-900'
                                : 'text-gray-700 font-light'
                        }`}
                    >
                        Publications
                    </Link>

                    <Link
                        to="/analytics"
                        className={`flex flex-col p-2.5 justify-center align-center text-center ${
                            location.pathname === '/analytics'
                                ? 'font-bold border-b-2 border-black-900'
                                : 'text-gray-700 font-light'
                        }`}
                    >
                        Statistics
                    </Link>
                </div>
            </div>
            <div className="flex flex-row justify-center items-center h-full absolute right-0 pr-16 md:pr-1">
                {authContext?.user ? (
                    <ProfileDropdown />
                ) : (
                    <Link to="/login" className="text-bodyMd text-gray-700 hover:text-black font-semibold">
                        Log in
                    </Link>
                )}
            </div>
        </div>
    );
};
