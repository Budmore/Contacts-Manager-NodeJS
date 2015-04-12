'use strict';

var Promise = require('bluebird');
	// ContactModel   = require('../../app/models/contact');

var service = require('../../app/services/contacts/contacts-service');
var mail = require('../../app/services/mail/mail');

var cronJobs = {
	checkAndSend: function() {

		var today = new Date();

		var promise = new Promise(function(resolve) {

			service.findContactsByDate(today).then(function(data) {
				if (data.length) {

					var headers = {
						to: 'j.mach@budmore.pl',
						subject: 'Pamiętaj o życzeniach'
					};

					var options = {
						data: {
							contacts: data
						},
						template: 'notification'
					};

					mail.generateTemplate(options).then(function(data) {

						var message = {
							text: data.text,
							html: data.html
						};

						mail.sendOne(headers, message).then(function(data) {
							resolve(data);
						});

					});


				} else {
					resolve('no one has birthday');
				}

			});
		});

		return promise;


	}
};

module.exports = {
	checkAndSend: cronJobs.checkAndSend
};
