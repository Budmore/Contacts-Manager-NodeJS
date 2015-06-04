var config  = require('../../config');
var server  = require('../../app/server');
var jwt     = require('jsonwebtoken');
var request = require('superagent');
var assert  = require('chai').assert;

var port      = config.port;
var version   = config.version;
var baseUrl   = 'http://localhost:' + port + version;

var UserModel   = require('../../app/models/user');


describe('Module Auth: auth-service', function() {
	'use strict';

	var _mockedUser = {
		email: 'mocked@email.com',
		password: '[secret]'
	};

	before(function(done) {
		server.start(port, done);
	});

	after(function(done) {
		server.stop(done);
	});

	beforeEach('Create some user', function(done){

		request
			.post(baseUrl + '/users')
			.send(_mockedUser)
			.end(function(err, res) {
				// assert.isNull(err);
				assert.isUndefined(res.body.password);
				assert.equal(res.status, 201);

				done();
			});

	});

	it('should check is user was created', function(done) {

		var query = UserModel.where({email: _mockedUser.email});

		query
			.findOne()
			.exec(function(err, user) {
				assert.isNull(err);
				assert.equal(user.email, _mockedUser.email);

				done();
			});

	});

	it('should check login credential - error (no password)', function(done) {
		var _fakeCredential = {
			email: _mockedUser.email,
			password: ''
		};
		request
			.post(baseUrl + '/users/login')
			.send(_fakeCredential)
			.end(function(err, res) {
				assert.equal(res.status, 401);
				assert.isUndefined(res.body.token);

				done();
			});
	});

	it('should check login credential - error (incorrect pass)', function(done) {
		var _fakeCredential = {
			email: _mockedUser.email,
			// password: _mockedUser.password
			password: 'kucyk1'
		};

		request
			.post(baseUrl + '/users/login')
			.send(_fakeCredential)
			.end(function(err, res) {
				assert.isDefined(err);
				assert.equal(res.status, 401);
				assert.isUndefined(res.body.token);

				done();
			});
	});

	it('should check login credential - success (generateToken)', function(done) {
		var _fakeCredential = {
			email: _mockedUser.email,
			password: _mockedUser.password
		};

		request
			.post(baseUrl + '/users/login')
			.send(_fakeCredential)
			.end(function(err, res) {
				assert.isNull(err);
				assert.equal(res.status, 200);

				var validToken = jwt.verify(res.body.token, config.secret);

				assert.equal(validToken.email, _mockedUser.email);

				done();
			});
	});

});
