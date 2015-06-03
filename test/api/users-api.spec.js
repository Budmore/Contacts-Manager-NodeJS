var assert  = require('chai').assert;
var request = require('superagent');
var server  = require('../../app/server');
var config  = require('../../config');
var scrypt  = require('scrypt');

var port    = config.port;
var version = config.version;
var baseUrl = 'http://localhost:' + port + version;
var UserModel = require('../../app/models/user');

describe('User API', function() {
	'use strict';

	before(function(done) {
		server.start(port, done);
	});

	after(function(done) {
		server.stop(done);
	});

	it('should get all contacts', function(done) {


		request
			.get(baseUrl + '/users')
			.end(function(err, res) {
				assert.isNull(err);
				assert.isObject(res.body);
				assert.equal(res.status, 200);
				assert.isArray(res.body.data);

				done();
			});

	});


	it('should create new user and verify hash password', function(done) {

		var _data = {
			email: 'jakubo@2.pl',
			password: '[secret]'
		};
		request
			.post(baseUrl + '/users')
			.send(_data)
			.end(function(err, res) {
				assert.isNull(err);
				assert.equal(res.status, 201);

				done();
			});

	});

	describe('prams with id', function() {
		var mockedUser = {
			_id: '55166e70fb1e9a18818ad8fd',
			email: 'jakub@o2.pl',
			password: '[secret]'
		};

		beforeEach('Create model with id (to test on it)',function(done) {

			var createContact = new UserModel(mockedUser);

			createContact.save(function(err, doc) {
				assert.isNull(err);
				assert.ok(doc);
				assert.isObject(doc);
				done();
			});

		});


		it('should get user by id', function(done) {

			request
				.get(baseUrl + '/users/' + mockedUser._id)
				.end(function(err, res) {
					assert.isNull(err);
					assert.isObject(res);

					assert.equal(res.body._id, mockedUser._id);
					assert.equal(res.body.email, mockedUser.email);
					assert.isUndefined(res.body.password);
					assert.equal(res.status, 200);
					done();
				});

		});


		it('should get 404 if contact does not exists', function(done) {

			request
				.get(baseUrl + '/users/fake-id')
				.end(function(err, res) {
					assert.isObject(err);
					assert.isObject(res);
					assert.equal(res.status, 404);

					done();
				});

		});


		it('should update existing contact', function(done) {
			var updatedContact = {
				_id: '55166e70fb1e9a18818ad8fd',
				email: 'test@aa.com',
				// password: 'some'
			};

			request
				.put(baseUrl + '/contacts/' + mockedUser._id)
				.send(updatedContact)
				.end(function(err, res) {
					assert.isNull(err);
					assert.equal(res.status, 200);
					assert.equal(res.body.firstname, updatedContact.firstname);
					assert.equal(res.body.nickname, mockedUser.nickname);
					done();
				});
		});


		it.skip('should remove existing contact', function(done) {
			var countBefore, countAfter;

			// Count documents before
			ContactModel.count({}, function(err, count) {
				countBefore = count;
			});

			// Delete Request
			request
				.del(baseUrl + '/contacts/' + mockedUser._id)
				.end(function(err, res) {
					assert.isNull(err);
					assert.equal(res.status, 200);

					// Count documents after DELETE
					ContactModel.count({}, function(err, count) {
						countAfter = count;

						assert.equal(countBefore, 1);
						assert.equal(countAfter, 0);
						done();
					});
				});

		});

	});


});
