'use strict';

var config = require('../../config');
var middleware = require('./token-verify');

var jwt = require('jsonwebtoken');
var httpMocks = require('node-mocks-http');
var chaiAsPromised = require('chai-as-promised');
var chai = require('chai');
var assert = chai.assert;

chai.use(chaiAsPromised);


var req, res;
beforeEach(function () {
	req = httpMocks.createRequest();
	res = httpMocks.createResponse();
});

describe('Middlewares "token-verify"', function () {

	it('should rejected - 2 no token', function () {


		return assert.isRejected(middleware.tokenVerify(req, res))
			.then(function (respond) {
				assert.equal(respond.status, 403);
			});



	});

	it('should rejected - 2 invalid token', function () {
		req.headers['x-access-token'] = 'blabla';


		return assert.isRejected(middleware.tokenVerify(req, res))
			.then(function (respond) {
				assert.equal(respond.status, 401);
			});


	});


	it('should valid token - resolve', function () {
		var payload = {
			email: 'test@tes.com'
		};

		// @TODO: mock 3th party services
		var token = jwt.sign(payload, config.secret);
		req.query.token = token;

		return assert.isFulfilled(middleware.tokenVerify(req, res))
			.then(function () {
				assert.equal(res.statusCode, 200);
				assert.equal(req.decoded.email, payload.email);
			});


	});
});
