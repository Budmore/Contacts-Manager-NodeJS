/* jshint latedef:nofunc */
'use strict';

var jwt       = require('jsonwebtoken');
var scrypt    = require('scrypt');
var validator = require('validator');

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

	/**
	 * Create new user, and generate JWT (JSON Web Token)
	 *
	 * Method: POST
	 * http://budmore.pl/api/v1/users/register
	 *
	 * @param {Object} req Request data
	 * @param {Object} res Respond data
	 * return {Object}     User with token
	 */
	createUser: function(req, res) {

		// Email validate
		if (!validator.isEmail(req.body.email)) {
			return res.status(400).send('Please enter a valid email address.');
		}

		// Password validate
		if (!req.body.password || req.body.password.length < 6) {
			return res.status(400).send('The password must be at least 6 characters');
		}

		var hashedPassword = scrypt.passwordHashSync(req.body.password, 0.01);


		var _user = {
			email: req.body.email,
			password: hashedPassword,
			notificationsTypes: {
				email: true,
				sms: false
			},
			recipients: {
				emails: [],
				phones: []
			}
		};


		var createUser = new UserModel(_user);

		createUser.save(function(err, user) {

			if (err) {
				return res.status(500).send(err);
			}

			if (user) {

				var userCopy = JSON.parse(JSON.stringify(user)); // Copy user object
				delete userCopy.password; // Remove hashed password
				userCopy.token = generateToken(user); // Generate token

				res.status(201).send(userCopy);
			}

		});
	},


	/**
	 * Get user data by token
	 *
	 * @param  {object} req Request data
	 * @param  {object} res Respond data
	 * @return {Object}     User object
	 */
	getUserByToken: function(req, res) {
		var tokenID = req.decoded._id;

		if (!tokenID) {
			res.status(401).send('Unauthorized');
		}

		var query = {
			_id: tokenID
		};

		UserModel.findOne(query, function(err, user) {
			if (err) {
				return res.status(500).send(user);
			}

			res.send(user);
		});
	}

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
	login: auth.login,
	createUser: auth.createUser,
	getUserByToken: auth.getUserByToken
};
