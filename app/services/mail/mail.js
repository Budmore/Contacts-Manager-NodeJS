'use strict';

var _ = require('lodash'),
	fs = require('fs'),
	path = require('path'),
	config = require('../../../config'),
	nodemailer = require('nodemailer'),
	htmlToText = require('html-to-text'),
	templatesDir = path.resolve(__dirname, 'templates'),
	smtpTransport = require('nodemailer-smtp-transport'),
	stubTransport = require('nodemailer-stub-transport'),
	logService = require('../log/log-service'),
	mail;


mail = {
	/**
	 * Verify connection configuration
	 * @returns {object} promise
	 */
	smtpVerifyConfig: function() {
		var transporter = nodemailer.createTransport(smtpTransport({
			host: config.mailer.host,
			port: config.mailer.port,
			auth: {
				user: config.mailer.auth.user,
				pass: config.mailer.auth.pass
			}
		}));

		return new Promise(function (resolve, reject) {
			transporter.verify(function (error) {
				if (error) {
					reject(error);
				} else {
					resolve('Server is ready to take our messages');
				}
			});
		});
	},

	/**
	 * Send email
	 * @param  {object} headers Data to send
	 * @param  {object} message Message to send
	 */
	sendOne: function(headers, message) {

		// create reusable transport object using SMTP transport
		var transport = nodemailer.createTransport(smtpTransport({
			host: config.mailer.host,
			port: config.mailer.port,
			auth: {
				user: config.mailer.auth.user,
				pass: config.mailer.auth.pass
			}
		}));

		// @TODO remove test specifc code
		if (process.env.SPEC) {
			//stubTransport Nodemailer STUB transport (for unit tests)
			transport = nodemailer.createTransport(stubTransport());
		}

		var bcc = [].concat(headers.bcc, config.mailer.defaultFromAddress);
		var mailOptions = {
			from: headers.from || config.mailer.defaultFromAddress,
			to: headers.to,
			bcc: bcc,
			subject: headers.subject,
			text: message.text,
			html: message.html
		};

		return new Promise(function (resolve, reject) {
			transport.sendMail(mailOptions, function(error, info){
				if (error){
					logService.error('SenMail error: ' + JSON.stringify(error));
					reject(error);
					return;
				}

				resolve(info);
			});
		});
	},

	/**
	 *
	 *
	 *	@param {object} options
	 *	@returns {*}
	 */
	generateTemplate: function (options) {

		var	templateData = options.data;
		templateData.siteUrl = config.siteUrl;
		templateData.contactMail = config.emails && config.emails.contact;

		_.templateSettings.variable = 'data';

		// read the proper email body template
		return new Promise(function (resolve, reject) {
			fs.readFile(templatesDir + '/' + options.template + '.html', {encoding: 'utf8'}, function (err, fileContent) {
				if (err) {
					reject(err);
				}

				// insert user-specific data into the email
				// https://lodash.com/docs#template
				var templatePre = _.template(fileContent);
				var templateHtml = templatePre(templateData);

				// generate a plain-text version of the same email
				var textContent = htmlToText.fromString(templateHtml);

				resolve({
					html: templateHtml,
					text: textContent
				});
			});
		});
	}
};

module.exports = {
	smtpVerifyConfig: mail.smtpVerify,
	sendOne: mail.sendOne,
	generateTemplate: mail.generateTemplate
};
