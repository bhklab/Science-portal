import React from 'react';
import Pub from '../../interfaces/Pub';
import { PublicationImage } from '../PublicationImage/PublicationImage';


const PublicationModalContent: React.FC<{ pub: Pub }> = ({ pub }) => {
    return (
        <div className='flex flex-col gap-10 py-10 px-[120px]'>
			<div className='flex flex-col gap-5 pb-10 border-b-2 border-gray-200'>
				<div className='h-28 w-28 overflow-hidden rounded-lg border-1 border-gray-200 flex justify-center items-center'>
					<PublicationImage image={pub.image} />
				</div>
				<div className='flex flex-col gap-2'>
					<h1 className='text-heading2Xl font-semibold text-black-900'>{pub.name}</h1>
					<p>{pub.authors}</p>
					<div className='flex flex-row gap-2 text-bodyMd text-gray-700 font-normal'>
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
				</div>
				<div className='flex flex-col gap-3 rounded-[4px] p-5 bg-gray-50 border-1 border-gray-200'>
					<div className='flex flex-row'>
						<p className='w-full'>
							Digital Object Identifier
						</p>
						<a href={`https://doi.org/${pub.doi}`} target='_blank' rel='noreferrer'>
							<img src="/images/assets/goto-link-icon.svg" alt="Go to link" className='h-6 w-6'/>
						</a>
					</div>
					<div className='flex flex-row gap-2 items-center'>
						<img src="/images/assets/doi-icon.svg" alt="Doi" className='h-6 w-6'/>
						<p className='text-bodyMd'>
							https://doi.org/{pub.doi}
						</p>
					</div>
				</div>
			</div>
			<div className='flex flex-col gap-5'>
				<h1 className='text-headingXl text-black-900 font-semibold'>
					Repositories
				</h1>
				<div className='flex flex-col gap-3 rounded-[4px] p-5 bg-gray-50 border-1 border-gray-200'>
					<div className='flex flex-row'>
						<p className='w-full'>
							Github
						</p>
						<a href='https://www.google.com' target='_blank' rel='noreferrer'>
							<img src="/images/assets/goto-link-icon.svg" alt="Go to link" className='h-6 w-6'/>
						</a>
					</div>
					<div className='flex flex-row gap-2 items-center'>
						<img src="/images/assets/github-icon.svg" alt="Doi" className='h-6 w-6'/>
						<p className='text-bodyMd'>
							https://www.github.com
						</p>
					</div>
				</div>
				<div className='flex flex-col gap-3 rounded-[4px] p-5 bg-gray-50 border-1 border-gray-200'>
					<div className='flex flex-row'>
						<p className='w-full'>
							Code Ocean
						</p>
						<a href='https://www.google.com' target='_blank' rel='noreferrer'>
							<img src="/images/assets/goto-link-icon.svg" alt="Go to link" className='h-6 w-6'/>
						</a>
					</div>
					<div className='flex flex-row gap-2 items-center'>
						<img src="/images/assets/codeocean-icon.svg" alt="Doi" className='h-6 w-6'/>
						<p className='text-bodyMd'>
							https://www.codeocean.com
						</p>
					</div>
				</div>
			</div>
			<div className='flex flex-col gap-5'>
				<h1 className='text-headingXl text-black-900 font-semibold'>
					Data
				</h1>
				<div className='flex flex-col gap-3 rounded-[4px] p-5 bg-gray-50 border-1 border-gray-200'>
					<div className='flex flex-row'>
						<p className='w-full'>
							Clinical Trial
						</p>
						<a href='http://clinicaltrials.gov/show/NCT02500407' target='_blank' rel='noreferrer'>
							<img src="/images/assets/goto-link-icon.svg" alt="Go to link" className='h-6 w-6'/>
						</a>
					</div>
					<div className='flex flex-row gap-2 items-center'>
						<img src="/images/assets/checker-icon.svg" alt="clinical trial" className='h-4 w-4'/>
						<p className='text-bodyMd'>
							http://clinicaltrials.gov/show/NCT02500407
						</p>
					</div>
				</div>
				<div className='flex flex-col gap-3 rounded-[4px] p-5 bg-gray-50 border-1 border-gray-200'>
					<div className='flex flex-row'>
						<p className='w-full'>
							Excel Sheet
						</p>
						<a href='https://static-content.springer.com/esm/art%3A10.1038%2Fs41467-022-31408-y/MediaObjects/41467_2022_31408_MOESM4_ESM.xlsx' target='_blank' rel='noreferrer'>
							<img src="/images/assets/goto-link-icon.svg" alt="Go to link" className='h-6 w-6'/>
						</a>
					</div>
					<div className='flex flex-row gap-2 items-center'>
						<img src="/images/assets/checker-icon.svg" alt="Doi" className='h-4 w-4'/>
						<p className='text-bodyMd'>
							https://static-content.springer.com/esm/art%3A10.1038%2Fs41467-022-31408-y/MediaObjects/41467_2022_31408_MOESM4_ESM.xlsx
						</p>
					</div>
				</div>
			</div>
        </div>
    );
};

export default PublicationModalContent;
