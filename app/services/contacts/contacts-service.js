'use strict';

var _ = require('lodash');
var dateFns = require('date-fns');
var ContactModel = require('../../../app/models/contact');

var service = {

	/**
	 * Find contacts by date
	 *
	 * @param  {date} date
	 * @param  {string} _userid
	 *
	 * @return {array} Contacts with matching date
	 */
	findContactsByDate: function (_userid, date) {
		var _search = {
			_userid: _userid,
			dates: {
				$elemMatch: {
					day: date.getDate(),
					month: date.getMonth()
				}
			}
		};

		return new Promise(function (resolve, reject) {
			ContactModel.find(_search, function (err, contacts) {

				if (err) {
					reject(err);
				}

				_.each(contacts, function (contact) {
					var filtered = _.filter(contact.dates, {
						day: date.getDate(),
						month: date.getMonth()
					});

					contact.dates = filtered;
				});

				resolve(contacts);
			});
		});
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

		return Promise.all(promises).then(contacts => _.flatten(contacts))
	},


	/**
	 * Find all contacts by current day of the month, across all users
	 *
	 * @param  {date} date
	 *
	 * @return {array} Contacts with matching date
	 */
	findContactsByDateForAllUsers: function (date) {
		var _search = {
			dates: {
				$elemMatch: {
					day: date.getDate(),
					month: date.getMonth()
				}
			}
		};

		return new Promise(function (resolve, reject) {
			ContactModel.find(_search, function (err, contacts) {

				if (err) {
					reject(err);
				}

				_.each(contacts, function (contact) {
					var filtered = _.filter(contact.dates, {
						day: date.getDate(),
						month: date.getMonth()
					});

					contact.dates = filtered;
				});

				resolve(contacts);
			});
		});
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

		return Promise.all(promises).then(contacts => _.flatten(contacts))
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
				var _isoDate = new Date(date.date);
				if (dateFns.isValid(_isoDate)) {
					date.date = _isoDate;
					date.year = _isoDate.getFullYear();
					date.month = _isoDate.getMonth();
					date.day = _isoDate.getDate();
				}
			}
		});

		return dates;
	}

};


module.exports = {
	findContactsByDate: service.findContactsByDate,
	findAllContactsByDateRange: service.findAllContactsByDateRange,
	findContactsByDateForAllUsers: service.findContactsByDateForAllUsers,
	findAllContactsByDateRangeForAllUsers: service.findAllContactsByDateRangeForAllUsers,
	parseDates: service.parseDates
};
