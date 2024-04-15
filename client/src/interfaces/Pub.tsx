export default interface Pub {
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