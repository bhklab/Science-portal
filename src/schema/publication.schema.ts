import mongoose, {Schema} from "mongoose";

export const PublicationSchema = new Schema({
	PMID: Number,
	doi: String,
	date: String,
	name: String,
	journal: String,
	type: String,
	authors: String,
	affiliations: String,
	image: String,
	citations: Number,
	status: String,
	repoLinks: {
		codeOcean: String,
		github: String,
		dggap: String,
		GEO: String,
		EGA: String,
		protocols: String,
		other: String
	},
},
{ collection: 'scienceportal'});


