'use strict';

var Promise        = require('bluebird'),
	ContactModel   = require('../../app/models/contact');

var service = {

	/**
	 * Find contact by Birthdate
	 * @param  {date} date
	 * @param  {function} callback
	 * @return {array} Contacts with matching date
	 */
	birthdateCheck: function(date) {

		var _search = {
			'birthdate.month': date.getMonth(),
			'birthdate.day': date.getDate()
		};

		var result = new Promise(function(resolve, reject) {

			ContactModel.find(_search, function(err, doc) {
				if (err) {
					reject(err);
				}
				resolve(doc);
			});


		});

		return result;

	}

};


module.exports = {
	birthdateCheck: service.birthdateCheck
};
