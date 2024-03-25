import React, { useState } from 'react';
// import Card from './Card';
import data from './data/data.json'

export const CardView: React.FC = () => {

	const [drop, setDrop] = useState<true | false>(false);

    return (
		<div className='flex flex-row flex-wrap gap-4 justify-center'>
			{		
				data.map((pub) => (
					<div className='flex flex-col w-80 rounded-lg shadow-card border-1 border-gray-200 bg-white' key={pub.PMID}>
						<div className='h-48 w-80 px-10 py-14 flex flex-col justify-center items-center border-b-1 border-gray-200'>
							<img src={`/images/publication/${pub.image}`} alt="publication" className='max-h-full max-w-full'/>
						</div>
						<div className='p-5'>
							<div className='flex flex-row gap-2 mb-5'>
								<a href='https://google.com'>
									<img src="/images/assets/doi-icon.svg" alt="icon" className='h-6 w-6'/>
								</a>
								<a href='https://google.com'>
									<img src="/images/assets/github-icon.svg" alt="icon" className='h-6 w-6'/>
								</a>
								<a href='https://google.com'>
									<img src="/images/assets/codeocean-icon.svg" alt="icon" className='h-6 w-6'/>
								</a>
							</div>
							<h2 className='text-headingMd font-semibold mb-2'>
								{pub.name.length > 85 ? `${pub.name.substring(0, 85)}...` : pub.name}
							</h2>
							<p className='text-bodyMd mb-8'>
								{pub.authors.length > 60 ? `${pub.authors.substring(0, 60)}...` : pub.authors}
							</p>
							<div className='flex flex-row justify-between items-end'>
								<div className='flex flex-col gap-1'>
									<p className='text-bodyMd text-gray-700'>
										{pub.journal}
									</p>
									<p className='text-bodyMd text-gray-700'>
										{pub.date}
									</p>
									<p className='text-bodyMd text-gray-700'>
										{pub.citations} citations
									</p>
								</div>
								<div className="relative inline-block text-left">
								<button
									className='px-4 py-2 flex flex-row gap-2 items-center shadow-md rounded-md border border-gray-300 bg-white'
									onClick={() => setDrop(!drop)}
								>
									<span className='text-sm font-semibold'>Open in</span>
									<img src="/images/assets/down-point-icon.svg" alt="Expand" className="w-4 h-4"/>
								</button>
								{drop && (
									<div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
									<div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
										<a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Option 1</a>
										<a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Option 2</a>
										<a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Option 3</a>
									</div>
									</div>
								)}
								</div>
							</div>
						</div>
					</div>
				))
			}
		</div>


    );
}

