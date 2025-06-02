import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import html2canvas from 'html2canvas';

interface ExportDomDropdownProps {
    targetRef: React.RefObject<HTMLElement>;
    filename?: string;
    className?: string;
}

const ExportDomDropdown: React.FC<ExportDomDropdownProps> = ({
    targetRef,
    filename = 'open-science-statistics',
    className = ''
}) => {
    const exportAsImage = async (targetRef: React.RefObject<HTMLElement>, filename: string, format: 'png' | 'jpeg') => {
        if (!targetRef.current) {
            console.warn('No target ref found!');
            return;
        }

        // Clone the original content
        const original = targetRef.current;
        const clone = original.cloneNode(true) as HTMLElement;

        // Create a padded wrapper and apply Tailwind-like styling
        const paddedWrapper = document.createElement('div');
        paddedWrapper.style.padding = '20px';
        paddedWrapper.style.display = 'flex';
        paddedWrapper.style.flexDirection = 'row';
        paddedWrapper.style.flexWrap = 'wrap';
        paddedWrapper.style.gap = '20px'; // match your Tailwind `gap-5`
        paddedWrapper.style.width = '900px'; // match your layout constraint
        paddedWrapper.style.justifyContent = 'center'; // if using `xs:justify-center`
        paddedWrapper.style.borderRadius = '8px'; // match Tailwind's `rounded-lg` if desired

        // Ensure all styles are inherited
        paddedWrapper.className = original.className || '';
        paddedWrapper.appendChild(clone);

        // Move off-screen
        paddedWrapper.style.position = 'absolute';
        paddedWrapper.style.top = '-9999px';
        paddedWrapper.style.left = '-9999px';

        document.body.appendChild(paddedWrapper);

        // Capture snapshot
        console.log(format);
        const canvas = await html2canvas(paddedWrapper, {
            useCORS: true,
            backgroundColor: format === 'jpeg' ? 'white' : null,
            scale: 2
        });

        // Clean up
        document.body.removeChild(paddedWrapper);

        // Export image
        const mime = format === 'png' ? 'image/png' : 'image/jpeg';
        const dataURL = canvas.toDataURL(mime, 1.0);
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = `${filename}.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className={`flex flex-row justify-center items-center text-center rounded-md p-2 ${className}`}>
            <Menu as="div" className="relative inline-block text-left">
                <div>
                    <Menu.Button className="flex flex-row justify-center items-center text-center gap-1 w-full bg-black/20 text-headingXs xs:text-bodyXs font-semibold text-black-900">
                        <img src="/images/assets/download-icon-black.svg" alt="Download icon" />
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
                    <Menu.Items className="absolute left-[-10px] top-[35px] w-44 rounded-md bg-white mt-1 z-10">
                        <div className="px-1 py-1 shadow-md rounded-lg border-1 border-gray-200">
                            {/* <Menu.Item>
                                {({ active }) => (
                                    <button
                                        onClick={() => exportAsImage(targetRef, filename, 'png')}
                                        className={`${
                                            active ? 'bg-gray-100' : 'text-gray-900'
                                        } group flex w-full items-center rounded-md px-2 py-2 text-xs`}
                                    >
                                        <img src="/images/assets/download-icon-black.svg" alt="icon" className="mr-1" />
                                        Export as PNG
                                    </button>
                                )}
                            </Menu.Item> */}
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        onClick={() => exportAsImage(targetRef, filename, 'jpeg')}
                                        className={`${
                                            active ? 'bg-gray-100' : 'text-gray-900'
                                        } group flex w-full items-center rounded-md px-2 py-2 text-xs`}
                                    >
                                        <img src="/images/assets/download-icon-black.svg" alt="icon" className="mr-1" />
                                        Export stats as JPEG
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

export default ExportDomDropdown;
