import React, { useState, useMemo } from 'react';
import { Overview, Functionality, Data, Future } from '../components/AboutSections/About';

const About: React.FC = () => {
    const sections = useMemo(
        () => [
            { id: 'Overview', component: Overview },
            { id: 'Functionality', component: Functionality },
            { id: 'Data', component: Data },
            { id: 'Future', component: Future }
        ],
        []
    );
    const [selected, setSelected] = useState<string>('Overview');
    const Active = sections.find(s => s.id === selected)?.component;
    return (
        <div className="grid grid-cols-6 gap-6 py-32 max-w-[1100px] m-auto">
            <div className="flex flex-col col-span-1 sticky top-32 h-fit shrink-0 bg-white px-4 py-2 rounded-lg border border-1">
                {sections.map(item => (
                    <span
                        className={`text-headingLg py-2 hover:cursor-pointer ${selected === item.id ? 'font-bold' : 'text-gray-700 font-light'}`}
                        onClick={() => setSelected(item.id)}
                    >
                        {item.id}
                    </span>
                ))}
            </div>
            <div className="flex flex-col gap-10 mx-auto text-black-900 smd:px-4 col-span-5">
                {Active ? <Active /> : null}
            </div>
        </div>
    );
};

export default About;
