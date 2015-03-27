var assert = require('chai').assert;
var request = require('superagent');

var server = require('../app/server');
var port = 9010;
var version = '/api/v1';
var baseUrl = 'http://localhost:' + port + version;

describe('Contacts mangaer spec', function() {
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

	it('should get isAlive message from the server', function(done) {
		request
			.get(baseUrl + '/')
			.end(function(err, res) {
				var _msg = 'isAlive';
				assert.isNull(err);
				assert.ok(res);
				assert.equal(res.text, _msg);
				assert.equal(res.status, 200);
				done();
			});
	});
});

