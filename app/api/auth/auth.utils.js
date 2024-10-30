const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var config = require('../../../config');

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

function generateToken(user) {
	var payload = {
		_id: user._id,
		email: user.email,
	};
	var options = {
		expiresIn: '24h',
	};

	return jwt.sign(payload, config.jwtSecret, options);
}

module.exports = { hashPassword, checkPassword, generateToken };
