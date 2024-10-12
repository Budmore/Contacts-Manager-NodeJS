'use strict';

var jwt = require('jsonwebtoken');
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
var tokenVerify = function (req) {
	return new Promise(function (resolve, reject) {
		const authorization = req.headers['authorization'];
		const [_, token] = authorization?.split('Bearer ') ?? '';

		if (token) {
			jwt.verify(token, config.jwtSecret, function (err, decoded) {
				if (err) {
					reject({
						status: 401,
						message: err,
					});
				} else {
					req.decoded = decoded;
					resolve();
				}
			});
		} else {
			reject({
				status: 403,
				message: 'No token provided.',
			});
		}
	});
};

module.exports = {
	tokenVerify: tokenVerify,
};
