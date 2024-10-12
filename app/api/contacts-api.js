'use strict';
// Database
const ContactModel = require('../models/contact');
const contactsService = require('../../app/services/contacts/contacts-service');
const contacts = {
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
	getAll: async function (req, res) {
		const query = {
			_userid: req.decoded._id,
		};

		try {
			const contacts = await ContactModel.find(query).exec();

			const _result = {
				count: contacts.length,
				data: contacts,
			};
			res.json(_result);
		} catch (err) {
			res.status(500).send(err);
		}
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
	create: async function (req, res) {
		const _contact = {
			_userid: req.decoded._id,
			firstname: req.body.firstname,
			lastname: req.body.lastname,
			nickname: req.body.nickname,
			notes: req.body.notes,
			email: req.body.email,
			imageUrl: req.body.imageUrl,
			url: req.body.url,
			dates: req.body.dates,
		};

		if (_contact.dates && _contact.dates.length) {
			contactsService.parseDates(_contact.dates);
		}

		const createContact = new ContactModel(_contact);

		try {
			const doc = await createContact.save();
			res.send(doc);
		} catch (err) {
			res.status(500).send(err); // @todo different status for different types of error.
		}
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
	getById: async function (req, res) {
		const query = {
			_userid: req.decoded._id,
			_id: req.params.id,
		};

		try {
			const doc = await ContactModel.findOne(query).exec();
			if (!doc) {
				return res.status(404).send('Contact not found');
			}
			res.send(doc);
		} catch (err) {
			res.status(500).send(err);
		}
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
	updateById: async function (req, res) {
		const query = {
			_userid: req.decoded._id,
			_id: req.params.id,
		};

		const updatedContact = req.body;
		delete updatedContact._id;
		delete updatedContact._userid;

		if (updatedContact.dates && updatedContact.dates.length) {
			contactsService.parseDates(updatedContact.dates);
		}

		try {
			const doc = await ContactModel.findOneAndUpdate(
				query,
				{ $set: updatedContact },
				{ new: true }
			).exec();
			if (!doc) {
				return res.status(404).send('Contact not found');
			}
			res.send(doc);
		} catch (err) {
			res.status(500).send(err);
		}
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
	deleteById: async function (req, res) {
		const query = {
			_userid: req.decoded._id,
			_id: req.params.id,
		};

		try {
			const doc = await ContactModel.findOneAndRemove(query).exec();
			if (!doc) {
				return res.status(404).send('Contact not found');
			}
			res.status(204).send('Resource deleted successfully');
		} catch (err) {
			res.status(500).send(err);
		}
	},
};

module.exports = {
	getAll: contacts.getAll,
	create: contacts.create,
	getById: contacts.getById,
	updateById: contacts.updateById,
	deleteById: contacts.deleteById,
};
