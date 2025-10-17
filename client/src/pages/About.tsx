import React, { useState, useMemo } from 'react';
import { Overview, Functionality, Data, Future } from '../components/AboutSections/About';

const About: React.FC = () => {
    const sections = useMemo(
        () => [
            { id: 'Overview', component: Overview },
            { id: 'Functionalities', component: Functionality },
            { id: 'Data', component: Data }
            // { id: 'Future', component: Future }
        ],
        []
    );
    const [selected, setSelected] = useState<string>('Overview');
    const Active = sections.find(s => s.id === selected)?.component;
    return (
        <div className="grid grid-cols-4 gap-6 py-32 max-w-[1100px] m-auto">
            <div className="flex flex-col gap-2 col-span-1 sticky top-32 h-fit shrink-0 bg-white px-4 py-4 rounded-lg border border-1">
                <h3 className="flex flex-col text-headingLg font-bold text-sp_dark_green">Documentation Index</h3>
                <ul className="list-decimal pl-6">
                    {sections.map(item => (
                        <li
                            className={`text-headingMd py-1 hover:cursor-pointer hover:font-semibold group w-fit text-gray-700  ${selected === item.id ? 'font-semibold' : 'font-light'}`}
                            onClick={() => setSelected(item.id)}
                        >
                            {item.id}
                            <span
                                className={`block max-w-0 group-hover:max-w-full  transition-all duration-500 h-0.5 bg-gray-700 ${selected === item.id ? '!max-w-full' : ''}`}
                            ></span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="flex flex-col gap-10 mx-auto smd:px-4 col-span-3">{Active ? <Active /> : null}</div>
        </div>
    );
};

export default About;
