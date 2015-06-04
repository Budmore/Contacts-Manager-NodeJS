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
				notificationsTypes: {
					email: true,
					sms: false
				},
				recipients: {
					emails: ['lore@o2.pl', 'invalid-email', 'bogo@go.pl'],
					phones: ['+48 500 100 100']
				}
			};

			request
				.put(baseUrl + '/users/' + updatedContact._id)
				.send(updatedContact)
				.end(function(err, res) {
					assert.isNull(err);
					assert.equal(res.status, 200);
					assert.equal(res.body.email, updatedContact.email);

					assert.isUndefined(res.body.password);

					var emailsBefore = updatedContact.recipients.emails.length;
					var emailsAfter = res.body.recipients.emails.length;
					assert.equal(emailsAfter, emailsBefore - 1);

					done();
				});
		});


		it('should remove existing contact', function(done) {
			var countBefore, countAfter;

			// Count documents before
			UserModel.count({}, function(err, count) {
				countBefore = count;
			});

			// Delete Request
			request
				.del(baseUrl + '/users/' + mockedUser._id)
				.end(function(err, res) {
					assert.isNull(err);
					assert.equal(res.status, 200);

					// Count documents after DELETE
					UserModel.count({}, function(err, count) {
						countAfter = count;

						assert.equal(countBefore, 1);
						assert.equal(countAfter, 0);
						done();
					});
				});

		});

	});


});
