'use strict';

var _              = require('lodash'),
	Promise        = require('bluebird'),
	ContactModel   = require('../../../app/models/contact');

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

	}

};


module.exports = {
	findContactsByDate: service.findContactsByDate
};
