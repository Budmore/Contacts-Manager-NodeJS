'use strict';

// import the moongoose helper utilities
var mailer = require('./mail');
var assert = require('chai').assert;

describe('Service: mail', function () {
	it('should send email', function (done) {
		var headers = {
			to: 'j.mach@budmore.pl',
			subject: 'Password reset',
		};
		var message = {
			text: 'lorem',
			html: '<b>lorem</b>'
		};

		mailer.sendOne(headers, message).then(function (data) {
			assert.ok(data);
			done();
		});
	});

	it('should compiled test.html template with JSON data', function (done) {
		var options = {
			data: {
				importantValue: 'TDD is awesome!',
				contacts: [
					{ firstname: 'Jakub', lastname: 'Mach', birthdate: { year: 1987 } },
					{ firstname: 'Feliks', lastname: 'Mach', birthdate: { year: 1990 } }
				]
			},
			template: 'test'
		};

		mailer.generateTemplate(options).then(function (data) {
			assert.include(data.html, options.data.importantValue);
			assert.include(data.text, options.data.importantValue);
			assert.include(data.text, options.data.contacts[0].firstname);
			assert.include(data.text, options.data.contacts[1].firstname);

			done();
		});
	});


	it('should compiled notification.html template with JSON data', function (done) {
		var options = {
			data: {
				contacts: [
					{ firstname: 'Jakub', lastname: 'Mach', birthdate: { year: 1987 } },
					{ firstname: 'Feliks', lastname: 'Mach', birthdate: { year: 1990 } }
				]
			},
			template: 'notification'
		};

		mailer.generateTemplate(options).then(function (data) {
			assert.include(data.text, options.data.contacts[0].firstname);
			assert.include(data.text, options.data.contacts[1].firstname);

			done();
		});
	});
});
