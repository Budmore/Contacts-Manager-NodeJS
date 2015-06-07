var assert  = require('chai').assert;
var request = require('superagent');
var server  = require('../../app/server');
var config  = require('../../config');
var jwt     = require('jsonwebtoken');

var port      = config.port;
var version   = config.version;
var baseUrl   = 'http://localhost:' + port + version;
var UserModel = require('../../app/models/user');

var token;
var mockedPayload = {
	_id: '55166e70fb1e9a18818ad8fd',
	email: 'jakub@gmail.com'
};

describe('User API', function() {
	'use strict';

	before(function(done) {
		server.start(port, done);
	});

	after(function(done) {
		server.stop(done);
	});


	before('create mocked token', function(done) {

		token = jwt.sign(mockedPayload, config.secret);

		done();
	});


	it('should get all contacts - 1 (is not superadmin)', function(done) {

		request
			.get(baseUrl + '/users')
			.set('x-access-token', token)
			.end(function(err, res) {
				assert.isNull(err);
				assert.equal(res.status, 200);

				assert.isArray(res.body.data);

				done();
			});

	});

	it('should create new user', function(done) {

		var _data = {
			email: 'jakubo@2.pl',
			password: '[secret]'
		};
		request
			.post(baseUrl + '/users/register')
			.send(_data)
			.end(function(err, res) {
				assert.isNull(err);
				assert.isUndefined(res.body.password);
				assert.equal(res.status, 201);

				done();
			});

	});

	describe('with id', function() {
		var mockedUser = {
			_id: mockedPayload._id,
			email: mockedPayload.email,
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


		it('should get user by id - 1', function(done) {

			request
				.get(baseUrl + '/users/' + mockedUser._id)
				.set('x-access-token', token)
				.end(function(err, res) {
					assert.isNull(err);
					assert.isObject(res);
					assert.equal(res.status, 200);

					assert.equal(res.body._id, mockedUser._id);
					assert.isUndefined(res.body.password);

					done();
				});

		});


		it('should get user by id - 2 (is not superadmin)', function(done) {

			request
				.get(baseUrl + '/users/otherid' )
				.set('x-access-token', token)
				.end(function(err, res) {
					assert.equal(res.status, 403);
					done();
				});

		});

		it.skip('should get user by id - 3 (is superadmin)', function(done) {

			//@TODO: create superadmin
			request
				.get(baseUrl + '/users/fake-id')
				.set('x-access-token', token)
				.end(function(err, res) {
					assert.isObject(err);
					assert.isObject(res);
					assert.equal(res.status, 404);

					done();
				});

		});


		it('should update existing contact - 1', function(done) {
			var updatedContact = {
				_id: mockedPayload._id,
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
				.set('x-access-token', token)
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

		it('should update existing contact - 2 (is not superadmin) ', function(done) {
			var updatedContact = {
				_id: 'some-other-id',
				email: 'test@aa.com'
			};

			request
				.put(baseUrl + '/users/' + updatedContact._id)
				.set('x-access-token', token)
				.send(updatedContact)
				.end(function(err, res) {
					assert.isObject(err);
					assert.equal(res.status, 403);
					done();
				});
		});


		it('should remove existing contact - 1', function(done) {
			var countBefore, countAfter;

			// Count documents before
			UserModel.count({}, function(err, count) {
				countBefore = count;
			});

			// Delete Request
			request
				.del(baseUrl + '/users/' + mockedUser._id)
				.set('x-access-token', token)
				.end(function(err, res) {
					assert.isNull(err);
					assert.equal(res.status, 204);

					// Count documents after DELETE
					UserModel.count({}, function(err, count) {
						countAfter = count;

						assert.equal(countAfter, countBefore - 1);
						done();
					});
				});

		});

		it('should remove existing contact - 2 (is not superadmin)', function(done) {

			// Delete Request
			request
				.del(baseUrl + '/users/' + 'other-id')
				.set('x-access-token', token)
				.end(function(err, res) {
					assert.equal(res.status, 403);
					done();
				});

		});

	});


});
