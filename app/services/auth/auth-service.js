/* jshint latedef:nofunc */
'use strict';

var jwt       = require('jsonwebtoken');
var scrypt    = require('scrypt');
var config    = require('../../../config');
var UserModel = require('../../models/user');


var auth = {

	/**
	 * Login user and generate JWT (JSON Web Token)
	 *
	 * @param  {object} req Request data
	 * @param  {object} res Respond data
	 * @return {Object}     JWT token
	 */
	login: function(req, res) {

		var email = req.body.email;
		var password = req.body.password;

		if (!email || !password) {
			res.status(401).send({
				status: 401,
				message: 'Invalid credentials'
			});
			return;
		}

		//Find user\

		UserModel
			.findOne({email: email})
			.select('_id password email')
			.exec(function(err, user) {
				var isExist, isVerified;

				// Validate password
				if (user && user.password) {
					isExist = true;
					isVerified = scrypt.verifyHashSync(user.password, password);
				}

				// Success - generate and return token
				if (isExist && isVerified) {

					var result = {
						token: generateToken(user)
					};

					res.send(result);

				// Error - invalid credential
				} else {
					res.status(401).send({
						status: 401,
						message: 'Invalid credentials'
					});
					return;
				}

			}
		);


	},

};


/**
 * Private Function. Generate user token with "jsonwebtoken"
 * https://github.com/auth0/node-jsonwebtoken
 *
 * @param  {Object} user
 * @return {Object}      [description]
 */
function generateToken(user) {
	var payload = {
		_id: user._id,
		email: user.email
	};
	var options = {
		expiresInMinutes: 60 * 24 * 7 // 7days
	};

	var token = jwt.sign(payload, config.secret, options);

	return token;
}


module.exports = {
	login: auth.login
};
