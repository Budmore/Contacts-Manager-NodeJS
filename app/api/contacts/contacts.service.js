'use strict';

const _ = require('lodash');
const dateFns = require('date-fns');
const ContactModel = require('./contacts.model');

const service = {
	/**
	 * Find contacts by date
	 *
	 * @param  {date} date
	 * @param  {string} _userid
	 *
	 * @return {array} Contacts with matching date
	 */
	findContactsByDate: async function (_userid, date) {
		const _search = {
			_userid: _userid,
			dates: {
				$elemMatch: {
					day: date.getDate(),
					month: date.getMonth(),
				},
			},
		};

		// Await the result of the query
		let contacts = await ContactModel.find(_search).exec();

		// Filter each contact's dates based on the provided date
		contacts.forEach((contact) => {
			contact.dates = contact.dates.filter(
				(d) => d.day === date.getDate() && d.month === date.getMonth()
			);
		});

		return contacts;
	},

	/**
	 * Find contacts of all by date range
	 *
	 * @param  {Object} startDate
	 * @param  {Object} endDate
	 *
	 * @return {array} Contacts with matching dates
	 */
	findAllContactsByDateRange: function (_userid, startDate, endDate) {
		const promises = [];
		let loopDate = startDate;
		while (loopDate <= endDate) {
			let singleDayPromise = service.findContactsByDate(_userid, loopDate);
			promises.push(singleDayPromise);
			loopDate = dateFns.addDays(loopDate, 1);
		}

		return Promise.all(promises).then((contacts) => _.flatten(contacts));
	},

	/**
	 * Find all contacts by current day of the month, across all users
	 *
	 * @param  {date} date
	 *
	 * @return {array} Contacts with matching date
	 */
	findContactsByDateForAllUsers: async (date) => {
		const _search = {
			dates: {
				$elemMatch: {
					day: date.getDate(),
					month: date.getMonth(),
				},
			},
		};

		// Await the result of the query
		let contacts = await ContactModel.find(_search).exec();

		// Filter each contact's dates based on the provided date
		contacts.forEach((contact) => {
			contact.dates = contact.dates.filter(
				(d) => d.day === date.getDate() && d.month === date.getMonth()
			);
		});

		return contacts;
	},

	/**
	 * Find contacts of all users by date range
	 *
	 * @param  {Object} startDate
	 * @param  {Object} endDate
	 *
	 * @return {array} Contacts with matching dates
	 */
	findAllContactsByDateRangeForAllUsers: function (startDate, endDate) {
		const promises = [];
		let loopDate = startDate;
		while (loopDate <= endDate) {
			let singleDayPromise = service.findContactsByDateForAllUsers(loopDate);
			promises.push(singleDayPromise);
			loopDate = dateFns.addDays(loopDate, 1);
		}

		return Promise.all(promises).then((contacts) => _.flatten(contacts));
	},

	/**
	 * Set property year, month, day from each date in dates.
	 *
	 * @param  {Array} dates each object has property "date" with iso Date
	 * @return {Array}
	 */
	parseDates: function (dates) {
		if (!dates || dates.constructor !== Array) {
			return;
		}

		dates.forEach(function (date) {
			if (date && date.date) {
				const _isoDate = new Date(date.date);
				if (dateFns.isValid(_isoDate)) {
					date.date = _isoDate;
					date.year = _isoDate.getFullYear();
					date.month = _isoDate.getMonth();
					date.day = _isoDate.getDate();
				}
			}
		});

		return dates;
	},
};

module.exports = {
	findContactsByDate: service.findContactsByDate,
	findAllContactsByDateRange: service.findAllContactsByDateRange,
	findContactsByDateForAllUsers: service.findContactsByDateForAllUsers,
	findAllContactsByDateRangeForAllUsers:
		service.findAllContactsByDateRangeForAllUsers,
	parseDates: service.parseDates,
};
