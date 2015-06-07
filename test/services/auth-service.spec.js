var config  = require('../../config');
var server  = require('../../app/server');
var jwt     = require('jsonwebtoken');
var request = require('superagent');
var assert  = require('chai').assert;

var port      = config.port;
var version   = config.version;
var baseUrl   = 'http://localhost:' + port + version;

var UserModel   = require('../../app/models/user');

var globalToken;

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
			.post(baseUrl + '/auth/register')
			.send(_mockedUser)
			.end(function(err, res) {
				assert.isUndefined(res.body.password);
				assert.isDefined(res.body.token);
				assert.equal(res.status, 201);

				globalToken = res.body.token;

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


	it('should check login credential - 1 error (incorrect email)', function(done) {
		var _fakeCredential = {
			email: 'incorrect-mail.pl',
			password: 'some#password'
		};
		request
			.post(baseUrl + '/auth/login')
			.send(_fakeCredential)
			.end(function(err, res) {
				assert.equal(res.status, 401);
				assert.isUndefined(res.body.token);

				done();
			});
	});

	it('should check login credential - 2 error (no password)', function(done) {
		var _fakeCredential = {
			email: _mockedUser.email,
			password: ''
		};
		request
			.post(baseUrl + '/auth/login')
			.send(_fakeCredential)
			.end(function(err, res) {
				assert.equal(res.status, 401);
				assert.isUndefined(res.body.token);

				done();
			});
	});

	it('should check login credential - 3 error (incorrect pass)', function(done) {
		var _fakeCredential = {
			email: _mockedUser.email,
			// password: _mockedUser.password
			password: 'kucyk1'
		};

		request
			.post(baseUrl + '/auth/login')
			.send(_fakeCredential)
			.end(function(err, res) {
				assert.isDefined(err);
				assert.equal(res.status, 401);
				assert.isUndefined(res.body.token);

				done();
			});
	});

	it('should check login credential - 4 success (generateToken)', function(done) {
		var _fakeCredential = {
			email: _mockedUser.email,
			password: _mockedUser.password
		};

		request
			.post(baseUrl + '/auth/login')
			.send(_fakeCredential)
			.end(function(err, res) {
				assert.isNull(err);
				assert.equal(res.status, 200);

				var validToken = jwt.verify(res.body.token, config.secret);

				assert.equal(validToken.email, _mockedUser.email);

				done();
			});
	});


	it('should createUser() - create new user - 1 all is OK', function(done) {

		var _data = {
			email: 'jakubo@2.pl',
			password: '[secret]'
		};

		request
			.post(baseUrl + '/auth/register')
			.send(_data)
			.end(function(err, res) {
				assert.equal(res.status, 201);
				assert.isUndefined(res.body.password);
				assert.isDefined(res.body.token);

				done();
			});

	});

	it('should createUser() - create new user - 2 incorect email', function(done) {

		var _data = {
			email: 'jakubo',
			password: '[secret]'
		};

		request
			.post(baseUrl + '/auth/register')
			.send(_data)
			.end(function(err, res) {
				assert.equal(res.status, 400);
				assert.isUndefined(res.body.token);
				assert.isUndefined(res.body.password);

				done();
			});

	});

	it('should createUser() - create new user - 2 incorect password', function(done) {

		var _data = {
			email: 'jaku@bo.com',
			password: ''
		};

		request
			.post(baseUrl + '/auth/register')
			.send(_data)
			.end(function(err, res) {
				assert.equal(res.status, 400);
				done();
			});

	});


	it('should get user only by token', function(done) {
		request
			.get(baseUrl + '/auth/me')
			.set('x-access-token', globalToken)
			.end(function(err, res) {
				assert.equal(res.status, 200);
				assert.equal(res.body.email, _mockedUser.email);

				assert.isDefined(res.body.recipients);
				assert.isDefined(res.body.notificationsTypes);

				done();
			}) ;

	});

});
