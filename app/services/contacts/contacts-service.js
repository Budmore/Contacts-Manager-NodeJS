'use strict';

	var _        = require('lodash'),
	Promise      = require('bluebird'),
	moment       = require('moment'),
	ContactModel = require('../../../app/models/contact');

var service = {

	/**
	 * Find contacts by date
	 *
	 * @param  {date} date
	 * @return {array} Contacts with matching date
	 */
	findContactsByDate: function(date) {

		var _search = {
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
	parseDates: service.parseDates
};
