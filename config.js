require('dotenv').config();

module.exports = {
	siteUrl: process.env.SITE_URL,
	port: process.env.PORT,
	jwtSecret: process.env.JWT_SECRET,
	mongoUri: process.env.MONGO_URI,
	logsPathname: process.env.LOGS_PATHNAME,
	emails: {
		contact: process.env.EMAILS_CONTACT,
	},
	mailer: {
		auth: {
			user: process.env.MAILER_USER,
			pass: process.env.MAILER_PASS,
		},
		defaultFromAddress: process.env.MAILER_DEFAULT_EMAIL,
		host: process.env.MAILER_HOST,
		port: process.env.MAILER_PORT,
	},
};
