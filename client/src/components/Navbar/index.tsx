import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Navbar: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className="fixed top-0 z-20 w-full px-16 md:px-1 py-3 bg-white border-b-1 border-gray-200 duration-300 ease-in-out">
            <div
                className="hover:cursor-pointer"
                onClick={() => {
                    navigate('/');
                }}
            >
                <img src="/images/assets/science-portal-logo.svg" alt="science portal logo" />
            </div>
        </div>
    );
};
