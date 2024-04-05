import React from 'react';
// import Card from './Card';
import data from './data/data.json'
import { DropdownButton } from '../DropdownButton/DropdownButton';
import { PublicationImage } from '../PublicationImage/PublicationImage';


interface Pub {
	_id: {
	  $oid: string;
	};
	PMID: number;
	doi: string;
	date: string;
	name: string;
	journal: string;
	type: string;
	authors: string;
	filteredAuthors: string;
	affiliations: string;
	filteredAffiliations: string;
	image: string;
	rating: string;
	citations: number;
	status: string;
	repoLinks: {
	  codeOcean: string;
	  github: string;
	  dggap: string;
	  GEO: string;
	  EGA: string;
	  protocols: string;
	  PDF: string;
	  other: string;
	};
}
  
interface publications {
	pubs: Pub[];
}

export const CardView: React.FC<publications> = ({ pubs }) => {

    return (
		<div className='flex flex-row flex-wrap gap-4 justify-center pb-10'>
			{		
				pubs.map((pub) => (
					<div className='flex flex-col w-[318px] rounded-lg shadow-card border-1 border-gray-200 bg-white' key={pub.PMID}>
						<div className='h-48 w-[318px] px-8 py-12 flex flex-col justify-center items-center border-b-1 border-gray-200'>
							<PublicationImage image={pub.image} />
						</div>
						<div className='p-5 flex flex-col justify-between'>
							<div>
								<div className='flex flex-row gap-2 mb-4'>
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
									{pub.name.length > 50 ? `${pub.name.substring(0, 50)}...` : pub.name}
								</h2>
								<p className='text-bodyMd mb-8 h-10'>
									{pub.authors.length > 60 ? `${pub.authors.substring(0, 60)}...` : pub.authors}
								</p>
							</div>
							<div className='flex flex-row justify-between items-end'>
								<div className='flex flex-col gap-1 text-bodyMd text-gray-700 font-light'>
									<p>
										{pub.journal}
									</p>
									<p>
										{pub.date}
									</p>
									<p>
										{pub.citations} citations
									</p>
								</div>
								<DropdownButton/>
							</div>
						</div>
					</div>
				))
			}
		</div>


    );
}

