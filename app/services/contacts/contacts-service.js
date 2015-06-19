'use strict';

	var _        = require('lodash'),
	Promise      = require('bluebird'),
	moment       = require('moment'),
	ContactModel = require('../../../app/models/contact');

var service = {

	/**
	 * !deprected - use findAllContactsByDateRange
	 * Find contacts by date
	 *
	 * @param  {date} date
	 * @param  {string} _userid
	 *
	 * @return {array} Contacts with matching date
	 */
	findContactsByDate: function(_userid, date) {

		var _search = {
			_userid: _userid,
			dates: {
				$elemMatch: {
					day: date.getDate(),
					month: date.getMonth()
				}
			}
		};

		var result = new Promise(function(resolve, reject) {

			ContactModel.find(_search, function(err, doc) {
				if (err) {
					reject(err);
				}

				_.each(doc, function(contact) {

					var filtered = _.filter(contact.dates, {
						day: date.getDate(),
						month: date.getMonth()
					});

					contact.dates = filtered;

				});

				resolve(doc);

			});


		});

		return result;

	},

	/**
	 * Find contacts of all by date range
	 *
	 * @param  {Object} startDate
	 * @param  {Object} endDate
	 *
	 * @return {array} Contacts with matching dates
	 */
	findAllContactsByDateRange: function(startDate, endDate) {

		var _search = {
			dates: {
				$elemMatch: {
					day:{
						$gte: startDate.getDate(),
						$lte: endDate.getDate()
					},
					month:{
						$gte: startDate.getMonth(),
						$lte: endDate.getMonth()
					}

				}
			}
		};

		var result = new Promise(function(resolve, reject) {

			ContactModel
				.find(_search)
				.exec(function(err, contacts) {
					if (err) {
						reject(err);
					}


					resolve(contacts);
				});


		});

		return result;

	},







	/**
	 * Set property year, month, day from each date in dates.
	 *
	 * @param  {Array} dates each object has property "date" with iso Date
	 * @return {Array}
	 */
	parseDates: function(dates) {
		if (!dates || dates.constructor !== Array) {
			return;
		}

		dates.forEach(function(date) {

			if ( date && moment(date.date).isValid()) {
				var _isoDate = new Date(date.date);

				date.date = _isoDate;
				date.year = _isoDate.getFullYear();
				date.month = _isoDate.getMonth();
				date.day = _isoDate.getDate();
			}

		});


		return dates;
	}

};


module.exports = {
	findContactsByDate: service.findContactsByDate,
	findAllContactsByDateRange: service.findAllContactsByDateRange,
	parseDates: service.parseDates
};
