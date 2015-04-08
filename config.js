var config = {
	db: {
		production: 'mongodb://user:pass@budmore.pl:1234/contacts-manager-v1-prod',
		development: 'mongodb://localhost/contacts-manager-v1-dev',
		spec: 'mongodb://localhost/contacts-manager-v1-specs'
	},
	mailer: {
		auth: {
			user: 'test@example.com',
			pass: 'secret',
		},
		defaultFromAddress: 'First Last <test@examle.com>'
	}
};

module.exports = config;
