'use strict';

var Promise = require('bluebird');
	// ContactModel   = require('../../app/models/contact');

var service = require('../../app/services/birthdate-check');
var mail = require('../../app/services/mail/mail');

var cronJobs = {
	checkAndSend: function() {

		var today = new Date();

		var promise = new Promise(function(resolve, reject) {

			service.birthdateCheck(today).then(function(data) {
				console.log('data', data);
				if (data.length) {
					var headers = {
						to: 'j.mach@budmore.pl'
					};

					var message = {
						text: JSON.stringify(data)
					};

					mail.sendOne(headers, message).then(function(data) {
						resolve(data);
					});




				} else {
					reject('no data');
				}

			});
		});

		return promise;


	}
};

module.exports = {
	checkAndSend: cronJobs.checkAndSend
};
