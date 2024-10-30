'use strict';

var UserModel = require('../../api/users/users.model');
var mail = require('../mail/mail');
var contactsService = require('../../api/contacts/contacts.service');
var logService = require('../log/log-service');

var cronJobs = {
	checkAndSend: function (startDate) {
		return cronJobs
			.getContacts(startDate)
			.then(cronJobs.sortContactsByUser)
			.then(cronJobs.getUsers)
			.then(cronJobs.sendNotifications)
			.catch(function (error) {
				logService.error('checkAndSend error: ' + JSON.stringify(error));
			});
	},

	/**
	 * Get contacts by date range. if no param then find on upcoming week.
	 *
	 * @param  {Object|Date} startDate
	 * @param  {Object|Date} endDate
	 * @return {Object} return Promise with contacts in the array
	 */
	getContacts: function (startDate, endDate) {
		startDate = startDate || new Date(); // Today
		if (!endDate) {
			endDate = new Date();
			var days = 7; // Next week
			endDate.setTime(startDate.getTime() + days * 24 * 60 * 60 * 1000);
		}

		return contactsService.findAllContactsByDateRangeForAllUsers(
			startDate,
			endDate
		);
	},

	/**
	 * Sort all contacts by _userid
	 *
	 * @param  {Array} contacts
	 * @return {Object} Promise On resolve send result with contacts and _userids
	 */
	sortContactsByUser: function (contacts) {
		var result = {
			_userids: [],
			contacts: {},
		};

		return new Promise(function (resolve) {
			contacts.map(function (contact) {
				if (!contact._userid) {
					return;
				}

				if (!result.contacts[contact._userid]) {
					result._userids.push(contact._userid);
					result.contacts[contact._userid] = [];
				}

				result.contacts[contact._userid].push(contact);
			});

			resolve(result);
		});
	},

	/**
	 * Get users by result._userids
	 *
	 * @param  {Object} result
	 * @return {Object} Promise
	 */
	getUsers: function (result) {
		return new Promise(async function (resolve) {
			var query = {
				_id: {
					$in: result._userids,
				},
			};

			result.users = await UserModel.find(query).exec();

			resolve(result);
		});
	},

	/**
	 * Send Notifications - emails
	 *
	 * @param {object} result:
	 * result.users =  detailed info about users
	 * result._userids = _id list
	 * result.contacts = Object with (key, value). Key is _userid and value is a contacts list
	 */
	sendNotifications: function (result) {
		var promises = [];
		if (!result || !result.users || !result.contacts) {
			var errorMessage = 'sendNotifications: Missing data';
			logService.error(errorMessage);
			reject(errorMessage);
			throw new Error(errorMessage);
		}

		result.users.map(function (user) {
			if (user.notificationsTypes && user.notificationsTypes.email) {
				var headers = {
					to: user.email,
					bcc: user.recipients && user.recipients.emails,
					subject: 'Pamiętaj o życzeniach',
				};

				var options = {
					data: {
						contacts: result.contacts[user._id],
					},
					template: 'notification',
				};

				promises.push(
					mail.generateTemplate(options).then(function (data) {
						var message = {
							text: data.text,
							html: data.html,
						};

						logService.info('Send email to: ' + headers.to);
						return mail.sendOne(headers, message);
					})
				);
			}
		});

		return Promise.all(promises).catch(function (error) {
			logService.error('sendNotifications error: ', JSON.stringify(error));
		});
	},
};

module.exports = {
	checkAndSend: cronJobs.checkAndSend,
	getContacts: cronJobs.getContacts,
	sortContactsByUser: cronJobs.sortContactsByUser,
	getUsers: cronJobs.getUsers,
	sendNotifications: cronJobs.sendNotifications,
};
