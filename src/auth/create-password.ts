import bcrypt from 'bcrypt';

const saltRounds = 12;

async function hashPasswords() {
	// console.log('John:', await bcrypt.hash(johnPass, saltRounds));
	// console.log('Louis:', await bcrypt.hash(louisPass, saltRounds));
	// console.log('Morag:', await bcrypt.hash(moragPass, saltRounds));
	// console.log('Peter:', await bcrypt.hash(peterPass, saltRounds));
}

hashPasswords();