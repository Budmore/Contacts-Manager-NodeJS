'use strict';

var _ = require('lodash'),
	fs = require('fs'),
	path = require('path'),
	config = require('../../../config'),
	nodemailer = require('nodemailer'),
	{ convert } = require('html-to-text'),
	templatesDir = path.resolve(__dirname, 'templates'),
	logService = require('../log/log-service'),
	mail;

const createTransport = () =>
	nodemailer.createTransport({
		host: config.mailer.host,
		port: config.mailer.port,
		auth: {
			user: config.mailer.auth.user,
			pass: config.mailer.auth.pass,
		},
	});

const buildMailOptions = (headers, message) => {
	const { from, to, bcc = [] } = headers;
	const defaultFromAddress = config.mailer.defaultFromAddress;

	return {
		from: from || defaultFromAddress,
		to,
		bcc: [...bcc, defaultFromAddress],
		subject: headers.subject,
		text: message.text,
		html: message.html,
	};
};

mail = {
	/**
	 * Verify connection configuration
	 * @returns {object} promise
	 */
	smtpVerifyConfig: function () {
		var transporter = createTransport();

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
	sendOne: (headers, message) => {
		// create reusable transport object using SMTP transport
		const transport = createTransport();
		const mailOptions = buildMailOptions(headers, message);

		return new Promise(function (resolve, reject) {
			transport.sendMail(mailOptions, (error, info) => {
				if (error) {
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
		var templateData = options.data;
		templateData.siteUrl = config.siteUrl;
		templateData.contactMail = config.emails && config.emails.contact;

		_.templateSettings.variable = 'data';

		// read the proper email body template
		return new Promise(function (resolve, reject) {
			fs.readFile(
				templatesDir + '/' + options.template + '.html',
				{ encoding: 'utf8' },
				function (err, fileContent) {
					if (err) {
						reject(err);
					}

					// insert user-specific data into the email
					// https://lodash.com/docs#template
					var templatePre = _.template(fileContent);
					var templateHtml = templatePre(templateData);

					// generate a plain-text version of the same email
					var textContent = convert(templateHtml);

					resolve({
						html: templateHtml,
						text: textContent,
					});
				}
			);
		});
	},
};

module.exports = {
	smtpVerifyConfig: mail.smtpVerifyConfig,
	sendOne: mail.sendOne,
	generateTemplate: mail.generateTemplate,
};
