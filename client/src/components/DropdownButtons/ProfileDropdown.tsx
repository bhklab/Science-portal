import React, { Fragment, useContext } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { AuthContext } from '../../hooks/AuthContext';
import { useNavigate } from 'react-router-dom';

export const ProfileDropdown: React.FC = () => {
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);

    return (
        <div className="flex flex-row justify-center items-center text-center rounded-md p-2">
            <Menu as="div" className="relative inline-block text-left">
                <div>
                    <Menu.Button className="flex flex-row justify-center items-center text-center gap-3 w-full text-bodyMd text-black-900">
                        <img src="/images/assets/default-user-icon.svg" alt="Profile" className="h-7 w-7" />
                        Profile
                        <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
                    </Menu.Button>
                </div>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className="absolute left-[-50px] top-[35px] w-40 rounded-md bg-white mt-1 z-10">
                        <div className="px-1 py-1 shadow-md rounded-lg border-1 border-gray-200">
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        onClick={() => navigate(`/profile`)}
                                        className={` ${
                                            active ? 'bg-gray-100' : 'text-gray-1000'
                                        } flex flex-row items-center gap-2 p-1 w-full h-full`}
                                    >
                                        <img src="/images/assets/profile-icon.svg" alt="profile" />{' '}
                                        <p className="text-bodyMd">Profile page</p>
                                    </button>
                                )}
                            </Menu.Item>
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        onClick={authContext?.logout}
                                        className={`${
                                            active ? 'bg-gray-100' : 'text-gray-1000'
                                        } flex flex-row items-center gap-2 p-1 w-full h-full`}
                                    >
                                        <img src="/images/assets/logout-icon.svg" alt="logout" />
                                        <p className="text-bodyMd">Log out</p>
                                    </button>
                                )}
                            </Menu.Item>
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        </div>
    );
};
