import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { ListView } from '../components/CardView/ListView';

interface Option {
	name: string;
}

const options: Option[] = [
	{ name: 'Most Recent' },
	{ name: 'Most Citations' },
];

const Home: React.FC = () => {

    const [filter, setFilter] = useState<Option | null>(null);

	return (
		<>
			<div id='search-bar' className="fixed top-16 w-full shadow px-16 py-3 flex flex-row gap-4">
				<button>
					<img src="/images/assets/filter-button-icon.svg" alt="science portal logo" />
				</button>
				<div className="flex items-center w-full relative">
					<button className="absolute left-3 top-1/2 transform -translate-y-1/2">
						<img src="/images/assets/search-icon.svg" alt='search-icon' className="h-6 w-6"/>
					</button>
					<InputText placeholder="Search Publications" className='pl-12 pr-3 py-2 rounded border-1 border-gray-300 w-full'/>
				</div>
				<Dropdown value={filter} onChange={(e) => setFilter(e.value)} options={options} optionLabel="name" placeholder="Sort by: Most Recent" className="rounded border-1 border-gray-300 w-60"/>
			</div>
			<div className='w-full pt-32 px-16'>
				<div id='main' className='py-5 w-full'>
					<div className='flex flex-row justify-between items-center w-full'>
						<span className=''>
							6 of 120 publications
						</span>
						<div className='flex flex-row gap-2'>
							<img src='/images/assets/card-view-icon.svg'/>
							<img src='/images/assets/list-view-icon.svg'/>
						</div>
					</div>
				</div>
				<ListView />
			</div>
		</>
		
	);
}

export default Home;
