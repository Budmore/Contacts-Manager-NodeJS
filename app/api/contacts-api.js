'use strict';
// Database
var ContactModel = require('../models/contact');
var contactsService = require('../../app/services/contacts/contacts-service');
var contacts = {

	/**
	 * Get all contacts from db
	 *
	 * Method: GET
	 * http://budmore.pl/api/v1/contacts/
	 *
	 * @param  {object} req Request data
	 * @param  {object} res Respond data
	 * @return {array}
	 */
	getAll: function(req, res) {

		var query = {
			_userid: req.decoded._id
		};

		ContactModel.find(query, function(err, contacts) {
			if (err) {
				return res.status(500).send(err);
			}

			var _result = {
				count: contacts.length,
				data: contacts
			};

			res.json(_result);
		});



	},

	/**
	 * Create new contact
	 *
	 * Method: POST
	 * http://budmore.pl/api/v1/contacts/
	 *
	 * @param  {object} req Request data
	 * @param  {object} res Respond data
	 */
	create: function(req, res) {

		var _contact = {
			_userid: req.decoded._id,
			firstname: req.body.firstname,
			lastname: req.body.lastname,
			nickname: req.body.nickname,
			notes: req.body.notes,
			email: req.body.email,
			imageUrl: req.body.imageUrl,
			url: req.body.url,
			dates: req.body.dates
		};

		if (_contact.dates && _contact.dates.length) {
			contactsService.parseDates(_contact.dates);
		}

		var createContact = new ContactModel(_contact);

		createContact.save(function(err, doc) {
			if (err) {
				// @todo diffrent status for diffrent type of error.
				return res.status(500).send(err);
			}

			res.send(doc);

		});
	},

	/**
	 * Get one contact from db. Find it by id in the request params.
	 *
	 * Method: GET
	 * http://budmore.pl/api/v1/contacts/:id
	 *
	 * @param  {object} req Request data
	 * @param  {object} res Respond data
	 * @return {object}
	 */
	getById: function(req, res) {

		var query = {
			_userid: req.decoded._id,
			_id: req.params.id
		};


		ContactModel.findOne(query, function(err, doc) {
			if (err) {
				return res.status(404).send(err);
			}

			res.send(doc);
		});
	},

	/**
	 * Update contact. Find it by id in the request params
	 *
	 * Method: PUT
	 * http://budmore.pl/api/v1/contacts/:id
	 *
	 * @param  {object} req Request data
	 * @param  {object} res Respond data
	 * @return {object}
	 */
	updateById: function(req, res) {

		var query = {
			_userid: req.decoded._id,
			_id: req.params.id
		};

		var updatedContact = req.body;
		delete updatedContact._id;
		delete updatedContact._userid;


		if (updatedContact.dates && updatedContact.dates.length) {
			contactsService.parseDates(updatedContact.dates);
		}

		ContactModel.findOneAndUpdate(query, {$set: updatedContact}, {new: true },
			function(err, doc) {if (err) {
				return res.status(404).send(err);
			}

			res.send(doc);

		});
	},

	/**
	 * Delete contact. Find it by id in the request params
	 *
	 * Method: DELETE
	 * http://budmore.pl/api/v1/contacts/:id
	 *
	 * @param  {object} req Request data
	 * @param  {object} res Respond data
	 * @return {object}
	 */
	deleteById: function(req, res) {

		var query = {
			_userid: req.decoded._id,
			_id: req.params.id
		};

		ContactModel.findOneAndRemove(query, function(err) {
			if (err) {
				return res.status(404).send(err);
			}

			res.status(204).send('Resource deleted successfully');
		});
	}



};


module.exports = {
	getAll: contacts.getAll,
	create: contacts.create,
	getById: contacts.getById,
	updateById: contacts.updateById,
	deleteById: contacts.deleteById
};
