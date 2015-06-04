'use strict';
var scrypt    = require('scrypt');
var validator = require('validator');
var UserModel = require('../models/user');

var usersApi = {


	/**
	 * Get all users from db
	 *
	 * Method: GET
	 * http://budmore.pl/api/v1/users/
	 *
	 * @param  {object} req Request data
	 * @param  {object} res Respond data
	 * @return {array}
	 */
	getAll: function(req, res) {
		UserModel
			.find({})
			.populate('password') //Exclude the password field
			.exec(function(err, users) {
				if (err) {
					return res.status(500).send.err;
				}

				var _result = {
					count: users.length,
					data: users
				};

				res.json(_result);

			}
		);

	},


	/**
	 * Create new user
	 *
	 * Method: POST
	 * http://budmore.pl/api/v1/users/
	 *
	 * @param  {object} req Request data
	 * @param  {object} res Respond data
	 */
	create: function(req, res) {

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
				email: false,
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
				// @todo diffrent status for diffrent type of error.
				return res.status(500).send(err);
			}

			if (user) {

				var userCopy = JSON.parse(JSON.stringify(user));
				delete userCopy.password;

				res.status(201).send(userCopy);
			}

		});
	},

	/**
	 * Find user by id.
	 *
	 * Method: GET
	 * http://budmore.pl/api/v1/users/:id
	 *
	 * @param  {object} req Request data
	 * @param  {object} res Respond data
	 * @return {object}
	 */
	getById: function(req, res) {
		var _id = req.params && req.params.id;

		// exclude the filed "password"
		var projection = {
			password: 0
		};

		UserModel.findById(_id, projection, function(err, user) {
			if (err) {
				return res.status(404).send(err);
			}


			res.send(user);
		});
	},

	/**
	 * Update user. Without password
	 *
	 * Method: PUT
	 * http://budmore.pl/api/v1/users/:id
	 *
	 * @param  {object} req Request data
	 * @param  {object} res Respond data
	 * @return {object}
	 */
	updateById: function(req, res) {
		// Validate user root email
		var reqEmail = req.body.email;
		if (!reqEmail || !validator.isEmail(reqEmail)) {
			return res.status(400).send();
		}


		var updatedContact = {
			notificationsTypes: {},
			recipients: {}
		};

		var _id = req.params && req.params.id;
		var recipients = req.body.recipients;

		updatedContact.email = reqEmail;
		updatedContact.phone = req.body.phone || null;
		updatedContact.image = req.body.image || null;
		updatedContact.notificationsTypes = req.body.notificationsTypes;
		updatedContact.recipients.phones = recipients.phones;


		// Validate emails
		if (recipients && recipients.emails) {
			var parsedArray = recipients.emails.filter(function(email) {
				if (validator.isEmail(email)) {
					return true;
				}
			});
			updatedContact.recipients.emails = parsedArray;
		}


		// Update model
		UserModel.findByIdAndUpdate(_id, {$set: updatedContact}, function(err, user) {
			if (err) {
				return res.status(404).send(err);
			}


			var copyUser = JSON.parse(JSON.stringify(user));
			delete copyUser.password;

			res.send(copyUser);

		});
	},

	/**
	 * Delete user.
	 *
	 * Method: DELETE
	 * http://budmore.pl/api/v1/users/:id
	 *
	 * @param  {object} req Request data
	 * @param  {object} res Respond data
	 * @return {object}
	 */
	deleteById: function(req, res) {

		var _id = req.params && req.params.id;

		UserModel.findByIdAndRemove(_id, function(err) {

			if (err) {
				return res.status(404).send(err);
			}

			res.status(200).send();
		});
	}
};




module.exports = {
	getAll: usersApi.getAll,
	create: usersApi.create,
	getById: usersApi.getById,
	updateById: usersApi.updateById,
	deleteById: usersApi.deleteById
};
