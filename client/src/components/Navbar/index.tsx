import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ProfileDropdown } from '../DropdownButtons/ProfileDropdown';
import { AuthContext } from '../../hooks/AuthContext';
import { Menu } from 'primereact/menu';

export const Navbar: React.FC = () => {
    const location = useLocation();
    const authContext = useContext(AuthContext);

    const [menuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => setMenuOpen(!menuOpen);

    return (
        <div className="flex justify-between fixed top-0 z-20 w-full h-16 bg-white border-b-1 border-gray-200">
            {/* Logo and Links */}
            <div className="flex flex-row items-center absolute left-0 pl-16 md:pl-1 h-16">
                <Link to="/" className="duration-300 ease-in-out hover:cursor-pointer mr-4">
                    <img
                        src="/images/assets/science-portal-logo.svg"
                        alt="science portal logo"
                        className="h-[40px] w-[220px]"
                    />
                </Link>
                <div className="sm:hidden flex h-full justify-center align-center">
                    <Link
                        to="/"
                        className={`flex flex-col p-2.5 justify-center align-center text-center smd:text-bodyMd mmd:text-bodySm smd:p-1 ${
                            location.pathname === '/'
                                ? 'font-bold border-b-2 border-black-900'
                                : 'text-gray-700 font-light'
                        }`}
                    >
                        Publications
                    </Link>

                    <Link
                        to="/analytics"
                        className={`flex flex-col p-2.5 justify-center align-center text-center smd:text-bodyMd mmd:text-bodySm smd:p-1 ${
                            location.pathname === '/analytics'
                                ? 'font-bold border-b-2 border-black-900'
                                : 'text-gray-700 font-light'
                        }`}
                    >
                        Statistics
                    </Link>

                    <Link
                        to="/about"
                        className={`flex flex-col p-2.5 justify-center align-center text-center smd:text-bodyMd mmd:text-bodySm smd:p-1 ${
                            location.pathname === '/about'
                                ? 'font-bold border-b-2 border-black-900'
                                : 'text-gray-700 font-light'
                        }`}
                    >
                        About
                    </Link>
                </div>
            </div>

            {/* Profile Dropdown */}
            <div className="sm:hidden flex flex-row justify-center items-center h-full absolute right-0 pr-16 md:pr-1">
                {authContext?.user ? (
                    <ProfileDropdown />
                ) : (
                    <Link to="/login" className="text-bodyMd text-gray-700 hover:text-black font-semibold">
                        Log in
                    </Link>
                )}
            </div>

            {/* Mobile Menu Button */}
            <div className="burger:hidden flex flex-row justify-center items-center h-full absolute right-0 pr-6">
                <button className="p-button-text text-gray-700 hover:text-black" onClick={toggleMenu}>
                    <img src="/images/assets/hamburger-icon.svg" alt="" className="h-5 w-5" />
                </button>
            </div>

            {/* Mobile Menu */}
            <div
                className={`absolute top-16 right-0 bg-white shadow-lg w-2/3 transition-transform duration-300 h-screen ${
                    menuOpen ? 'transform translate-x-0' : 'transform translate-x-full'
                }`}
            >
                <div className="flex flex-col items-start pl-2">
                    <Link
                        to="/"
                        className={`p-4 text-gray-700 hover:text-black ${
                            location.pathname === '/' ? 'font-bold' : 'font-light'
                        }`}
                        onClick={() => setMenuOpen(false)}
                    >
                        Publications
                    </Link>
                    <Link
                        to="/analytics"
                        className={`p-4 text-gray-700 hover:text-black ${
                            location.pathname === '/analytics' ? 'font-bold' : 'font-light'
                        }`}
                        onClick={() => setMenuOpen(false)}
                    >
                        Statistics
                    </Link>
                    <Link
                        to="/about"
                        className={`p-4 text-gray-700 hover:text-black ${
                            location.pathname === '/about' ? 'font-bold' : 'font-light'
                        }`}
                        onClick={() => setMenuOpen(false)}
                    >
                        About
                    </Link>
                    {authContext?.user ? (
                        <ProfileDropdown />
                    ) : (
                        <Link
                            to="/login"
                            className="p-4 text-gray-700 hover:text-black font-light"
                            onClick={() => setMenuOpen(false)}
                        >
                            Log in
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};
