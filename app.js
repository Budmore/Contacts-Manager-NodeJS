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
var contactsController = require('./app/api/contacts/contacts.controller');
var usersController = require('./app/api/users/users.controller');
var authController = require('./app/api/auth/auth.controller');
var notificationsController = require('./app/api/notifications/notifications.controller');

app.get('/', function (req, res) {
	res.send('isAlive');
});

app
	// Contacts
	.post('/v1/contacts', tokenVerify, contactsController.create)
	.get('/v1/contacts', tokenVerify, contactsController.getAll)
	.get('/v1/contacts/:id', tokenVerify, contactsController.getById)
	.put('/v1/contacts/:id', tokenVerify, contactsController.updateById)
	.delete('/v1/contacts/:id', tokenVerify, contactsController.deleteById)

	// Auth
	.post('/v1/auth/login', authController.login)
	.post('/v1/auth/register', authController.createUser)
	.get('/v1/auth/me', tokenVerify, authController.getUserByToken)

	.get('/v1/user', tokenVerify, usersController.getUser) // isOwner
	.get('/v1/users', tokenVerify, usersController.getAll) // isSuperadmin
	.get('/v1/users/:id', tokenVerify, usersController.getById) // isSuperadmin || isOwner
	.put('/v1/users/:id', tokenVerify, usersController.updateById) // isSuperadmin || isOwner
	.delete('/v1/users/:id', tokenVerify, usersController.deleteById) // isSuperadmin || isOwner

	// Notifications
	.post(
		'/v1/notifications/check-and-send',
		notificationsController.checkAndSend
	)
	.post(
		'/v1/notifications/smtp-verify-config',
		notificationsController.smtpVerifyConfig
	);
