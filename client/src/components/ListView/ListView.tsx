import React from 'react';
import { DropdownButton } from '../DropdownButton/DropdownButton';
import { PublicationImage } from '../PublicationImage/PublicationImage';
import Pub from '../../interfaces/Pub';
  
interface publications {
	pubs: Pub[];
}

export const ListView: React.FC<publications> = ({ pubs }) => {
    return (
		<div className='flex flex-col items-center gap-4 justify-center pb-10'>
			{		
				pubs.map((pub) => (
					<div className='w-800 rounded-lg border-1 border-gray-200 shadow-card bg-white flex flex-row justify-between' key={pub.doi}>
                        <div className='p-5 w-[644px]'>
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
                                {pub.name.length > 100 ? `${pub.name.substring(0, 100)}...` : pub.name}
                            </h2>
                            <p className='text-bodyMd mb-2 h-10'>
                                {pub.authors.length > 60 ? `${pub.authors.substring(0, 60)}...` : pub.authors}
                            </p>
                            <div className='flex flex-row justify-between items-center'>
                                <div className='flex flex-row gap-2 text-bodyMd text-gray-700 font-light'>
                                    <p>
                                        {pub.journal}
                                    </p>
                                    <p>
                                        •
                                    </p>
                                    <p>
                                        {pub.date}
                                    </p>
                                    <p>
                                        •
                                    </p>
                                    <p>
                                        {pub.citations} citations
                                    </p>
                                </div>
                                <DropdownButton/>
                            </div>
                        </div>
                        <div className='flex flex-col justify-center items-center px-[33px] py-[55px] w-[156px] border-l-1 border-gray-200'>
                            <PublicationImage image={pub.image} />
                        </div>

					</div>
				))
			}
		</div>


    );
}

