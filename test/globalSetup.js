const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

// https://typegoose.github.io/mongodb-memory-server/docs/guides/integration-examples/test-runners/
module.exports = async function globalSetup() {
	const instance = await MongoMemoryServer.create();
	const uri = instance.getUri();
	global.__MONGOINSTANCE = instance;

	process.env.MONGO_URI = uri;

	// The following is to make sure the database is clean before a test suite starts
	const conn = await mongoose.connect(uri);
	await conn.connection.db.dropDatabase();
	await mongoose.disconnect();
};
