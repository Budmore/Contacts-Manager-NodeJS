const mongoose = require('mongoose');

module.exports = async function globalTeardown() {
	const instance = global.__MONGOINSTANCE;

	if (instance) {
		await instance.stop();
	}
};
