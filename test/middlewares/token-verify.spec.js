'use strict';

var jwt            = require('jsonwebtoken');
var httpMocks      = require('node-mocks-http');
var chai           = require('chai');
var chaiAsPromised = require('chai-as-promised');
var config         = require('../../config');
var middleware     = require('../../app/middlewares/token-verify');

var req, res;
var assert         = chai.assert;
var expect         = chai.expect;
chai.use(chaiAsPromised);


beforeEach(function() {
	req = httpMocks.createRequest();
	res = httpMocks.createResponse();
});

describe('Middlewares "token-verify"', function() {

	it('should no token - 403 rejected', function() {

		return expect(middleware.tokenVerify(req, res)).to.be.rejected
			.then(function() {
				assert.equal(res.statusCode, 403);
			});



	});

	it('should invalid token - 401 rejected', function() {
		req.headers['x-access-token'] = 'blabla';


		return expect(middleware.tokenVerify(req, res)).to.be.rejected
			.then(function() {
				assert.equal(res.statusCode, 401);
			});


	});


	it('should valid token - resolve', function() {
		var payload = {
			email: 'test@tes.com'
		};

		// @TODO: mock 3th party services
		var token = jwt.sign(payload, config.secret);
		req.query.token = token;

		return expect(middleware.tokenVerify(req, res)).to.be.fulfilled
			.then(function() {
				assert.equal(res.statusCode, 200);
				assert.equal(req.decoded.email, payload.email);
			});


	});
});
