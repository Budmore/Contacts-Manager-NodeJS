var config = {
	db: {
		production: "mongodb://user:pass@budmore.pl:1234/contacts-manager-v1-prod",
		development: "mongodb://localhost/contacts-manager-v1-dev",
		spec: "mongodb://localhost/contacts-manager-v1-specs"
	}
};

module.exports = config;
