'use strict';
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
		var isSuperadmin = false; //@TODO: add superadmin
		var tokenID = req.decoded._id;

		var query = {};


		// If is not superadmin get only user from token _id
		if (!isSuperadmin && tokenID) {
			query = {
				_id: tokenID
			};
		}

		UserModel
			.find(query)
			.exec(function(err, users) {
				if (err) {
					return res.status(500).send(err);
				}

				var _result = {
					count: users.length,
					data: users
				};

				res.send(_result);

			}
		);

	},



	/**
	 * Find user by token only.
	 *
	 * Method: GET
	 * http://budmore.pl/api/v1/users
	 *
	 * @param  {object} req Request data
	 * @param  {object} res Respond data
	 * @return {object}
	 */
	getUser: function(req, res) {
		var tokenID = req.decoded._id;

		if (!tokenID) {
			return res.status(400).send('Token is required');
		}

		UserModel.findOne({_id: tokenID}, function(err, user) {

			if (err) {
				return res.status(500).send(err);
			}

			res.send(user);
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
		var isSuperadmin = false; // @todo check is Superadmin
		var _id = req.params.id;
		var tokenID = req.decoded._id;


		if (_id !== tokenID) {
			if (!isSuperadmin) {
				return res.status(403).send('Forbiden');
			}
		}

		UserModel.findById(tokenID, function(err, user) {
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
		var notificationsTypes = req.body.notificationsTypes || {};
		var recipients = req.body.recipients || {};


		var isSuperadmin = false; // @todo check is Superadmin
		var _id = req.params.id;
		var tokenID = req.decoded._id;


		// Check is owner or superadmin
		if (_id !== tokenID) {
			if (!isSuperadmin) {
				return res.status(403).send('Forbiden');
			}
		}


		// Validate user root email
		var reqEmail = req.body.email;
		if (!reqEmail || !validator.isEmail(reqEmail)) {
			return res.status(400).send();
		}

		// Validate recipients emails
		if (recipients && recipients.emails) {
			var parsedArray = recipients.emails.filter(function(email) {
				if (validator.isEmail(email)) {
					return true;
				}
			});
			recipients.emails = parsedArray;
		}



		var updatedContact = {
			email: reqEmail,
			phone: req.body.phone || null,
			image: req.body.image || null,
			notificationsTypes: {
				email: notificationsTypes.email,
				sms: notificationsTypes.sms
			},
			recipients: {
				emails: recipients.emails,
				phones: recipients.phones,
			}
		};


		// Update model
		UserModel.findByIdAndUpdate(tokenID, {$set: updatedContact}, {new: true},
			function(err, user) {
				if (err) {
					return res.status(400).send(err);
				}


				var copyUser = JSON.parse(JSON.stringify(user));
				delete copyUser.password;

				res.send(copyUser);

			}
		);
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

		var isSuperadmin = false; // @todo check is Superadmin
		var _id = req.params.id;
		var tokenID = req.decoded._id;


		// Check is owner or superadmin
		if (_id !== tokenID) {
			if (!isSuperadmin) {
				return res.status(403).send('Forbiden');
			}
		}


		UserModel.findByIdAndRemove(tokenID, function(err) {

			if (err) {
				return res.status(404).send(err);
			}

			res.status(204).send('Resource deleted successfully');
		});
	}
};




module.exports = {
	getUser: usersApi.getUser,
	getAll: usersApi.getAll,
	create: usersApi.create,
	getById: usersApi.getById,
	updateById: usersApi.updateById,
	deleteById: usersApi.deleteById
};
