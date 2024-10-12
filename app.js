const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

const config = require('./config');

// CONFIGURATION
// -----------------------------------------------------------------------------
const app = express();
app.use(express.json()); // Parse JSON bodies
app.use(morgan('tiny')); // Log HTTP requests

mongoose
	.connect(config.mongoUri)
	.then(() => {
		console.log('MongoDB connected');
	})
	.catch((error) => {
		console.error('MongoDB connection failed:', error.message);
	});

// START THE SERVER
// -----------------------------------------------------------------------------
var server;
var start = (exports.start = function (port, callback) {
	console.log('server started');

	server = app.listen(port, callback);
});
var stop = (exports.stop = function (callback) {
	server.close(callback);
});

if (!process.env.SPEC) {
	start(config.port, function () {
		console.log('working on port:', config.port);
	});
}

// MIDDLEWARES
// -----------------------------------------------------------------------------
var middleware = require('./app/middlewares/token-verify');

var allowCrossDomain = function (req, res, next) {
	res.header('Access-Control-Allow-Origin', config.siteUrl);
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type,x-access-token');

	next();
};

var tokenVerify = function (req, res, next) {
	middleware
		.tokenVerify(req, res)
		.then(function () {
			next();
		})
		.catch(function (err) {
			res.status(err.status).send(err.message);
		});
};

app.use(allowCrossDomain);

// ROUTES
// -----------------------------------------------------------------------------

// var router = express.Router();
var contactsApi = require('./app/api/contacts-api');
var usersApi = require('./app/api/users-api');
var authService = require('./app/services/auth/auth-service');
var notificationsApi = require('./app/api/notifications-api');

app.get('/', function (req, res) {
	res.send('isAlive');
});

app
	// Contacts
	.post('/v1/contacts', tokenVerify, contactsApi.create)
	.get('/v1/contacts', tokenVerify, contactsApi.getAll)
	.get('/v1/contacts/:id', tokenVerify, contactsApi.getById)
	.put('/v1/contacts/:id', tokenVerify, contactsApi.updateById)
	.delete('/v1/contacts/:id', tokenVerify, contactsApi.deleteById)

	// Auth
	.post('/v1/auth/login', authService.login)
	.post('/v1/auth/register', authService.createUser)
	.get('/v1/auth/me', tokenVerify, authService.getUserByToken)

	.get('/v1/user', tokenVerify, usersApi.getUser) // isOwner
	.get('/v1/users', tokenVerify, usersApi.getAll) // isSuperadmin
	.get('/v1/users/:id', tokenVerify, usersApi.getById) // isSuperadmin || isOwner
	.put('/v1/users/:id', tokenVerify, usersApi.updateById) // isSuperadmin || isOwner
	.delete('/v1/users/:id', tokenVerify, usersApi.deleteById) // isSuperadmin || isOwner

	// Notifications
	.post('/v1/notifications/check-and-send', notificationsApi.checkAndSend)
	.post('/v1/notifications/check-and-send', notificationsApi.checkAndSend)
	.post(
		'/v1/notifications/smtp-verify-config',
		notificationsApi.smtpVerifyConfig
	);
