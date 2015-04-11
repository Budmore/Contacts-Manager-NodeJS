'use strict';

// import the moongoose helper utilities
var mailer = require('../../app/services/mail/mail');
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

		mailer.sendOne(headers, message).then(function(data) {
			assert.ok(data);
			done();
		});
	});

});
