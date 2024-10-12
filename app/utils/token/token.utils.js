var jwt = require('jsonwebtoken');
var config = require('../../../config');

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

module.exports = {
	generateToken,
};
