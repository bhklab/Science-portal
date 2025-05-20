import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';

interface DropdownButtonProps {
    onDownload: (format: string, chartType: string) => void;
    chartType: string;
}

export const ExportDropdown: React.FC<DropdownButtonProps> = ({ onDownload, chartType }) => {
    return (
        <div className="flex flex-row justify-center items-center text-center bg-blue-1000 rounded-md p-2 w-[120px] xs:w-[110px] ">
            <Menu as="div" className="relative inline-block text-left">
                <div>
                    <Menu.Button className="flex flex-row justify-center items-center text-center gap-1 w-full bg-black/20 text-headingXs xs:text-bodyXs font-semibold text-white">
                        <img src="/images/assets/download-icon.svg" alt="Download icon" />
                        Export Chart
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
                    <Menu.Items className="absolute left-[-40px] top-[35px] w-40 rounded-md bg-white mt-1 z-10">
                        <div className="px-1 py-1 shadow-md rounded-lg border-1 border-gray-200">
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        onClick={() => onDownload('png', chartType)}
                                        className={`${
                                            active ? 'bg-gray-100' : 'text-gray-900'
                                        } group flex w-full items-center rounded-md px-2 py-2 text-xs`}
                                    >
                                        <img src="/images/assets/download-icon-black.svg" alt="icon" className="mr-1" />
                                        Export as PNG
                                    </button>
                                )}
                            </Menu.Item>
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        onClick={() => onDownload('jpeg', chartType)}
                                        className={`${
                                            active ? 'bg-gray-100' : 'text-gray-900'
                                        } group flex w-full items-center rounded-md px-2 py-2 text-xs`}
                                    >
                                        <img src="/images/assets/download-icon-black.svg" alt="icon" className="mr-1" />
                                        Export as JPEG
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
