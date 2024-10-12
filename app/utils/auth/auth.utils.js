const bcrypt = require('bcrypt');

async function hashPassword(plainTextPassword) {
	const saltRounds = 10;
	try {
		return await bcrypt.hash(plainTextPassword, saltRounds);
	} catch (error) {
		throw new Error('Error hashing password');
	}
}

async function checkPassword(plainTextPassword, hashedPassword = '') {
	try {
		return await bcrypt.compare(plainTextPassword, hashedPassword);
	} catch (error) {
		throw new Error('Error checking password');
	}
}

module.exports = { hashPassword, checkPassword };
