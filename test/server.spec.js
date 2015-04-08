var assert = require('chai').assert;
var request = require('superagent');

var server = require('../app/server');
var port = 9010;
var version = '/api/v1';
var baseUrl = 'http://localhost:' + port + version;

describe('Contacts Manager', function() {
	beforeEach(function(done) {
		server.start(port, done);
	});

	afterEach(function(done) {
		server.stop(done);
	});

	it('should pass the test', function(done) {

		assert.equal(1+1, 2);

		done();
	});
});
