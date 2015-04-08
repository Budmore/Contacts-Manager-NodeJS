'use strict';
// Database
var ContactModel = require('../models/contact');

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

		ContactModel.find({}, function(err, doc) {
			if (err) {
				return res.status(500).send(err);
			}

			res.json(doc);
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
			firstname: req.body.firstname,
			lastname: req.body.lastname,
			nickname: req.body.nickname,
			notes: req.body.notes,
			email: req.body.email,
			url: req.body.url,
			birthdate: req.body.birthdate
		};

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
		var _id = req.params.id;

		ContactModel.findById(_id, function(err, doc) {
			if (err) {
				return res.status(500).send(err);
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

		var _id = req.params.id;

		var updatedContact = req.body;
		delete updatedContact._id;


		ContactModel.findByIdAndUpdate(_id, {$set: updatedContact}, function(err, doc) {
			if (err) {
				return res.status(500).send(err);
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

		var _id = req.params.id;

		ContactModel.findByIdAndRemove(_id, function(err) {
			if (err) {
				return res.status(500).send(err);
			}

			res.status(200).send();
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
