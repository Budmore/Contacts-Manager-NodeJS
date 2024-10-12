const nodemailer = require('nodemailer');
const { smtpVerifyConfig, sendOne, generateTemplate } = require('./mail');
const config = require('../../../config');

jest.mock('nodemailer');

describe('Service: mail', function () {
	verifyMock = jest.fn();
	sendMailMock = jest.fn();

	beforeEach(() => {
		mockTransporter = {
			verify: verifyMock,
			sendMail: sendMailMock,
		};
		nodemailer.createTransport.mockReturnValue(mockTransporter);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('smtpVerifyConfig()', () => {
		it('should resolve when transporter.verify succeeds', async () => {
			verifyMock.mockImplementation((callback) => callback(null));

			await expect(smtpVerifyConfig()).resolves.toBe(
				'Server is ready to take our messages'
			);

			expect(verifyMock).toHaveBeenCalledTimes(1);
		});

		it('should reject when transporter.verify fails', async () => {
			const error = new Error('Connection failed');

			verifyMock.mockImplementation((callback) => callback(error));

			await expect(smtpVerifyConfig()).rejects.toThrow('Connection failed');

			expect(verifyMock).toHaveBeenCalledTimes(1);
		});
	});

	describe('sendOne()', () => {
		it('should send email', async () => {
			var headers = {
				to: 'j.mach@budmore.pl',
				subject: 'Password reset',
			};
			var message = {
				text: 'lorem',
				html: '<b>lorem</b>',
			};

			const mockResponse = { messageId: '12345' };
			sendMailMock.mockImplementation((mailOptions, callback) => {
				callback(null, mockResponse);
			});

			const result = await sendOne(headers, message);

			expect(nodemailer.createTransport).toHaveBeenCalledTimes(1);
			expect(sendMailMock).toHaveBeenCalledTimes(1);
			expect(result).toEqual(mockResponse);
			expect(sendMailMock).toHaveBeenCalledWith(
				expect.objectContaining({
					from: config.mailer.defaultFromAddress,
					to: headers.to,
					bcc: [config.mailer.defaultFromAddress],
					subject: headers.subject,
					text: message.text,
					html: message.html,
				}),
				expect.any(Function)
			);
		});
	});

	describe('generateTemplate()', () => {
		it('should compile test.html template with JSON data', async () => {
			const options = {
				data: {
					importantValue: 'TDD is awesome!',
					contacts: [
						{ firstname: 'Jakub', lastname: 'Mach', birthdate: { year: 1987 } },
						{
							firstname: 'Feliks',
							lastname: 'Mach',
							birthdate: { year: 1990 },
						},
					],
				},
				template: 'test',
			};

			const data = await generateTemplate(options);

			expect(data.html).toContain(options.data.importantValue);
			expect(data.text).toContain(options.data.importantValue);
			expect(data.text).toContain(options.data.contacts[0].firstname);
			expect(data.text).toContain(options.data.contacts[1].firstname);
		});

		it('should compiled notification.html template with JSON data', async () => {
			const options = {
				data: {
					contacts: [
						{ firstname: 'Jakub', lastname: 'Mach', birthdate: { year: 1987 } },
						{
							firstname: 'Feliks',
							lastname: 'Mach',
							birthdate: { year: 1990 },
						},
					],
				},
				template: 'notification',
			};

			const data = await generateTemplate(options);

			expect(data.text).toContain(options.data.contacts[0].firstname);
			expect(data.text).toContain(options.data.contacts[1].firstname);
		});
	});
});
