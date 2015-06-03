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

		UserModel.find({}, function(err, users) {
			if (err) {
				return res.status(500).send.err;
			}

			var _result = {
				count: users.length,
				data: users
			};

			res.json(_result);

		});

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
			notificationsType: {
				email: false,
				sms: false
			},
			recipients: {
				emails: [],
				phones: []
			}
		};


		var createUser = new UserModel(_user);

		createUser.save(function(err, doc) {
			if (err) {
				// @todo diffrent status for diffrent type of error.
				return res.status(500).send(err);
			}


			res.send(doc);

		});
	},

	/**
	 * Find user by id.
	 *
	 * Method: GET
	 * http://budmore.pl/api/v1/users/:_id
	 *
	 * @param  {object} req Request data
	 * @param  {object} res Respond data
	 * @return {object}
	 */
	getById: function(req, res) {
		var _id = req.params.id;

		UserModel.findById(_id, function(err, doc) {
			if (err) {
				return res.status(500).send(err);
			}

			res.send(doc);
		});
	},


};




module.exports = {
	getAll: usersApi.getAll,
	create: usersApi.create,
	getById: usersApi.getById,
	// updateById: contacts.updateById,
	// deleteById: contacts.deleteById
};
