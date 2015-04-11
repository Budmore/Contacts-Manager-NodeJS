'use strict';

// import the moongoose helper utilities
var mailer = require('../../app/services/mail');
var nodemailer = require('nodemailer');
var assert = require('chai').assert;

var stubTransport = require('nodemailer-stub-transport');

describe.skip('Service: mail', function () {


	it('should send email', function (done) {


		var headers = {
			to: 'j.mach@budmore.pl',
			subject: 'Password reset',
		};
		var message = {
			text: 'lorem',
			html: '<b>lorem</b>'
		};

		var transport = nodemailer.createTransport(stubTransport());

		mailer.sendOne(headers, message, transport).then(function(data) {
			assert.ok(data);
			done();
		});
	});

});
