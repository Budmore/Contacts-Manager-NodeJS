'use strict';

var config = require('../../config');
var Promise = require('bluebird');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

/**
 * Send email
 * @param  {object} headers Data to send
 * @param  {object} message Message to send
 * @param  {object} stubTransport Nodemailer STUB transport (for unit tests)
 */
exports.sendOne = function(headers, message, stubTransport) {

	// create reusable transport object using SMTP transport
	var transport = stubTransport || nodemailer.createTransport(smtpTransport({
		host: config.mailer.host,
		port: config.mailer.port,
		auth: {
			user: config.mailer.auth.user,
			pass: config.mailer.auth.pass
		}
	}));

	var mailOptions = {
		from: headers.from || config.mailer.defaultFromAddress,
		to: headers.to,
		subject: headers.subject,
		text: message.text, // plaintext body
		html: message.html // html body
	};

	return new Promise(function (resolve, reject) {
		transport.sendMail(mailOptions, function(error, info){

			if(error){
				return reject(error);
			}

			resolve(info.response);

		});
	});
};
