import React, { Fragment, useState, useRef, useEffect } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

interface FilterDropdownProps {
    legendItems: string[];
    activeItems: Set<string>;
    toggleLegendItem: (item: string, chartType: string) => void;
    chartType: string;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
    legendItems,
    activeItems,
    toggleLegendItem,
    chartType
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleOutsideClick = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleOutsideClick);
        } else {
            document.removeEventListener('mousedown', handleOutsideClick);
        }
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isOpen]);

    return (
        <div
            className="flex flex-row justify-center items-center text-center bg-white rounded-md p-2 w-[90px] border-1 border-gray-300 shadow-button"
            ref={dropdownRef}
        >
            <Menu as="div" className="relative inline-block text-left">
                <div>
                    <Menu.Button
                        className="flex flex-row justify-center items-center text-center gap-1 w-full bg-black/20 text-headingXs font-semibold text-black"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <img src="/images/assets/filter-icon.svg" alt="Filter icon" />
                        Filter
                        <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
                    </Menu.Button>
                </div>
                <Transition
                    as={Fragment}
                    show={isOpen}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className="absolute left-[-70px] top-[35px] w-40 rounded-md bg-white mt-1 z-10">
                        <div className="px-1 py-1 shadow-md rounded-lg border-1 border-gray-200">
                            {legendItems.map(item => (
                                <Menu.Item key={item}>
                                    <div className="flex items-center px-2 py-1">
                                        <input
                                            type="checkbox"
                                            checked={activeItems.has(item)}
                                            onChange={() => toggleLegendItem(item, chartType)}
                                            className="mr-2 rounded-sm"
                                        />
                                        <span className="text-xs">{item}</span>
                                    </div>
                                </Menu.Item>
                            ))}
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        </div>
    );
};
