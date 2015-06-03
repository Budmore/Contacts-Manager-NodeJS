var assert = require('chai').assert;

var UserModel = require('../../app/models/user');

describe('Models: user', function() {
	'use strict';

	it('should create new user', function(done) {

		var _user = {
			email: 'jk.morgan@gmail.com',
			password: 'pritty#3strong)(password'
		};

		var createUser = new UserModel(_user);

		createUser.save(function(err, doc) {
			assert.isNull(err);
			assert.ok(doc);
			assert.isObject(doc);

			done();
		});

	});

});
