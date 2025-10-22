import React, { useState, useMemo } from 'react';
import { Overview, Functionality, Data, Future } from '../components/AboutSections/About';

type SectionDef = {
    id: string;
    component: React.FC<{ scrollTarget?: string | null }>;
    subsections: { id: string; value: string }[];
};

const About: React.FC = () => {
    const sections: SectionDef[] = useMemo(
        () => [
            {
                id: 'Overview',
                component: Overview,
                subsections: [
                    { id: 'what', value: 'What is the Science Portal' },
                    { id: 'problems', value: 'Open Science Issues' },
                    { id: 'solution', value: 'Open Science Solution' }
                ]
            },
            {
                id: 'Functionalities',
                component: Functionality,
                subsections: [
                    { id: 'search', value: 'Search' },
                    { id: 'institution-statistics', value: 'Institution Statistcs' },
                    { id: 'scientist-statistics', value: 'Scientist Statistcs' },
                    { id: 'edit', value: 'Editing a Publication' },
                    { id: 'submit', value: 'Submitting a Publication' },
                    { id: 'notify', value: 'Notify Director' }
                ]
            },
            {
                id: 'Data',
                component: Data,
                subsections: [
                    { id: 'publications', value: 'Publications' },
                    { id: 'publication-resources', value: 'Publication Resources' },
                    { id: 'members', value: 'Members' },
                    { id: 'citations', value: 'Citations' }
                ]
            }
        ],
        []
    );

    const [selected, setSelected] = useState<string>('Overview');
    const [selectedSub, setSelectedSub] = useState<string | undefined>(undefined);
    const [scrollTarget, setScrollTarget] = useState<string | null>(null);

    const Active = sections.find(s => s.id === selected)?.component;

    return (
        <div className="grid grid-cols-8 gap-6 py-32 max-w-[1200px] m-auto">
            <div className="flex flex-col gap-2 col-span-2 sticky top-32 h-fit shrink-0 bg-white px-4 py-4 rounded-lg border border-1 shadow-sm">
                <ul className="list-disc pl-6">
                    {sections.map(sects => (
                        <li
                            key={sects.id}
                            className={`text-headingMd py-1 hover:cursor-pointer hover:font-semibold hover:text-sp_dark_green group w-fit text-gray-700  ${selected === sects.id ? 'font-semibold text-sp_dark_green' : 'font-light'}`}
                            onClick={() => {
                                setSelected(sects.id);
                                setSelectedSub(undefined);
                                setScrollTarget(null);
                            }}
                        >
                            <div className="w-fit">
                                {sects.id}
                                <span
                                    className={`block max-w-0 group-hover:max-w-full  transition-all duration-500 h-0.5 bg-sp_dark_green ${selected === sects.id ? '!max-w-full' : ''}`}
                                />
                            </div>

                            {sects.subsections.length !== 0 && (
                                <ul className="list-disc pl-6">
                                    {sects.subsections.map(sub => (
                                        <li
                                            key={sub.id}
                                            className={`text-headingMd py-1 hover:cursor-pointer hover:text-sp_dark_green group w-fit text-gray-700 font-light ${selectedSub === sub.id ? 'text-sp_dark_green' : ''}`}
                                            onClick={e => {
                                                e.stopPropagation();
                                                setSelected(sects.id);
                                                setSelectedSub(sub.id);
                                                setScrollTarget(sub.id);
                                            }}
                                        >
                                            {sub.value}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="flex flex-col gap-10 mx-auto smd:px-4 col-span-6 text-gray-700 p-6 bg-white border-1 shadow-xs rounded-lg ">
                {Active ? <Active scrollTarget={scrollTarget} /> : null}
            </div>
        </div>
    );
};

export default About;
