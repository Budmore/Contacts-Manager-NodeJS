'use strict';

var Q      = require('q');
var jwt    = require('jsonwebtoken');
var config = require('../../config');


/**
 * Check and decode Json Web Token from request
 * https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens#route-middleware-to-protect-api-routes
 *
 * @param  {object} req Request data
 * @param  {object} res Respond data
 * @param  {Function} next
 *
 */
var tokenVerify = function(req, res) {
	var deferred = Q.defer();
	var token = req.headers['x-access-token'] || req.body.token || req.query.token;

	if (token) {
		jwt.verify(token, config.secret, function(err, decoded) {
			if (err) {
				res.status(401).send(err);
				deferred.reject();
			} else {
				req.decoded = decoded;
				deferred.resolve();
			}
		});


	} else {
		res.status(403).send('No token provided.');
		deferred.reject();
	}

	return deferred.promise;

};

module.exports = {
	tokenVerify: tokenVerify
};
