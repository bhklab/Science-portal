import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { CardView } from '../components/CardView/CardView';
import { ListView } from '../components/ListView/ListView';


interface Option {
	name: string;
}

const options: Option[] = [
	{ name: 'Most Recent' },
	{ name: 'Most Citations' },
];

const Home: React.FC = () => {

    const [filter, setFilter] = useState<Option | null>(null);
	const [cardView, setCardView] = useState<true | false>(true);

	return (
		<>
			<div id='search-bar' className="fixed top-16 w-full shadow-sm px-16 py-3 flex flex-row gap-4 border-t-1 border-gray-200 bg-white">
				<button>
					<img src="/images/assets/filter-button-icon.svg" alt="science portal logo" />
				</button>
				<div className="flex items-center w-full relative">
					<button className="absolute left-3 top-1/2 transform -translate-y-1/2">
						<img src="/images/assets/search-icon.svg" alt='search-icon' className="h-6 w-6"/>
					</button>
					<InputText placeholder="Search Publications" className='pl-12 pr-3 py-2 rounded border-1 border-gray-300 w-full'/>
				</div>
				<Dropdown value={filter} onChange={(e) => setFilter(e.value)} options={options} optionLabel="name" placeholder="Sort by: Most Recent" className="rounded border-1 border-gray-300 w-60text-black-900"/>
			</div>
			<div className='w-full pt-32 px-16 flex flex-col justify-center gap-5'>
				<div id='main' className='py-5 w-full'>
					<div className='flex flex-row justify-between items-center w-full'>
						<span className=''>
							6 of 120 publications
						</span>
						{
							cardView ? (
								<div className='flex flex-row gap-2'>
									<button onClick={() => setCardView(true)}>
										<img src='/images/assets/card-view-active-icon.svg' alt='card-view-active'/>
									</button>
									<button onClick={() => setCardView(false)}>
										<img src='/images/assets/list-view-icon.svg' alt='list-view'/>
									</button>
								</div>

							) :
							(
								<div className='flex flex-row gap-2'>
									<button onClick={() => setCardView(true)}>
										<img src='/images/assets/card-view-icon.svg' alt='card-view'/>
									</button>
									<button onClick={() => setCardView(false)}>
										<img src='/images/assets/list-view-active-icon.svg' alt='list-view-active'/>
									</button>
								</div>
							)
						}

					</div>
				</div>
				{
					cardView ? (
						<CardView />
					) :	(
						<ListView />
					)
				}
			</div>
		</>
		
	);
}

export default Home;
