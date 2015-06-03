var config = {
	environment: 'PRODUCTION', // PRODUCTION, DEVELOPMENT
	siteUrl: 'http://budmore.pl',
	port: 4000,
	version: '/api/v1',
	secret: '7D0vqBry%m6eC_Fn9ao%QABryq1w5QusokvuGMKbIf_ %SWHs1UL',
	db: {
		production: 'mongodb://user:pass@budmore.pl:1234/contacts-manager-v1-prod',
		development: 'mongodb://localhost/contacts-manager-v1-dev',
		spec: 'mongodb://localhost/contacts-manager-v1-specs'
	},
	mailer: {
		auth: {
			user: 'no-reply@gmail.com',
			pass: 'uO32a{]example33QKifdA#/+Q',
		},
		defaultFromAddress: 'Przypomnienie <no-reply@budmore.pl>',
		host: 'smtp.mydevil.net',
		port: 587
	}
};

module.exports = config;
