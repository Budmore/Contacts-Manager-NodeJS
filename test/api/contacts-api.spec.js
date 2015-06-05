var assert  = require('chai').assert;
var request = require('superagent');

var server  = require('../../app/server');
var config  = require('../../config');
var port    = config.port;
var version = config.version;
var baseUrl = 'http://localhost:' + port + version;

var ContactModel = require('../../app/models/contact');

describe('Contacts API', function() {
	'use strict';

	before(function(done) {
		server.start(port, done);
	});

	after(function(done) {
		server.stop(done);
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

	it('should get all contacts from DB', function(done) {
		request
			.get(baseUrl + '/contacts')
			.end(function(err, res) {
				assert.isNull(err);
				assert.isArray(res.body.data);
				assert.equal(res.status, 200);
				done();
			});
	});

	it('should create new contact', function(done) {

		var _data = {
			firstname: 'Jakub',
			lastname: 'Mach',
			dates: [{
				date: new Date()
			}]
		};

		request
			.post(baseUrl + '/contacts')
			.send(_data)
			.end(function(err, res) {
				assert.isNull(err);
				assert.isObject(res.body);
				assert.equal(res.status, 200);

				done();
			});

	});

	describe('with id', function() {
		var mockedContact = {
			_id: '55166e70fb1e9a18818ad8fd',
			firstname: 'Jakub',
			lastname: 'Mach',
			nickname: 'Budmore'
		};

		beforeEach('Create model with id (to test on it)',function(done) {

			var createContact = new ContactModel(mockedContact);

			createContact.save(function(err, doc) {
				assert.isNull(err);
				assert.ok(doc);
				assert.isObject(doc);
				done();
			});

		});


		it('should get contact by id', function(done) {

			request
				.get(baseUrl + '/contacts/' + mockedContact._id)
				.end(function(err, res) {
					assert.isNull(err);
					assert.isObject(res);
					assert.equal(res.body._id, mockedContact._id);
					assert.equal(res.body.lastname, mockedContact.lastname);
					assert.equal(res.status, 200);
					done();
				});

		});


		it('should get 404 if contact does not exists', function(done) {

			request
				.get(baseUrl + '/contacts/fake-id')
				.end(function(err, res) {
					assert.isDefined(err);
					assert.isObject(res);
					assert.equal(res.status, 404);
					done();
				});

		});


		it('should update existing contact', function(done) {
			var updatedContact = {
				_id: '55166e70fb1e9a18818ad8fd',
				firstname: 'Feliks',
				lastname: 'Mach',
				sone: 'aala'
			};

			request
				.put(baseUrl + '/contacts/' + mockedContact._id)
				.send(updatedContact)
				.end(function(err, res) {
					assert.isNull(err);
					assert.equal(res.status, 200);
					assert.equal(res.body.firstname, updatedContact.firstname);
					assert.equal(res.body.nickname, mockedContact.nickname);
					done();
				});
		});


		it('should remove existing contact', function(done) {
			var countBefore, countAfter;

			// Count documents before
			ContactModel.count({}, function(err, count) {
				countBefore = count;
			});

			// Delete Request
			request
				.del(baseUrl + '/contacts/' + mockedContact._id)
				.end(function(err, res) {
					assert.isNull(err);
					assert.equal(res.status, 204);

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
