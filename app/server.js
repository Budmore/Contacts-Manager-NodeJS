'use strict';
var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var NodeCron   = require('cron').CronJob;

var config     = require('../config');
var cronJobs   = require('../app/services/cron-jobs');






// CONFIGURATION
// -----------------------------------------------------------------------------
var port = process.env.PORT || config.port;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


if (!process.env.SPEC) {
	process.env[config.environment] = true; // Environment
	mongoose.connect(config.db.spec);
} else {
	mongoose.connect(config.db[config.environment.toLowerCase()]);
}



// START THE SERVER
// -----------------------------------------------------------------------------
var server;
var start = exports.start = function(port, callback) {
	server = app.listen(port, callback);
};
exports.stop = function(callback) {
	server.close(callback);
};

if (!process.env.SPEC) {
	start(port, function() {
		console.log('working');
	});
}




// CRON JOBS
// -----------------------------------------------------------------------------
new NodeCron({
	cronTime: '00 00 06 * * *', // Runs every day at 6:00 AM - crontab.org
	onTick: function() {
		console.log('Cron job: tick');
		cronJobs.checkAndSend();
	},
	start: true
});




// MIDDLEWARES
// -----------------------------------------------------------------------------
var middleware = require('../app/middlewares/token-verify');

var allowCrossDomain = function(req, res, next) {
	res.header('Access-Control-Allow-Origin', config.siteUrl);
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type,x-access-token');

	next();
};

var tokenVerify = function(req, res, next) {
	middleware.tokenVerify(req, res)
		.then(function() { next(); })
		.catch(function(err) {
			res.status(err.status).send(err.message);
		})
		.done();
};

app.use(allowCrossDomain);





// ROUTES
// -----------------------------------------------------------------------------

var router = express.Router();
var contactsApi = require('./api/contacts-api');
var usersApi = require('./api/users-api');
var authService = require('./services/auth/auth-service');


router.get('/', function(req, res) {
	res.send('isAlive');
});

// @TODO: Restrict access for unauthorized users.
router
	// Contacts
	.post('/contacts', tokenVerify, contactsApi.create)
	.get('/contacts', tokenVerify, contactsApi.getAll)
	.get('/contacts/:id', tokenVerify, contactsApi.getById)
	.put('/contacts/:id', tokenVerify, contactsApi.updateById)
	.delete('/contacts/:id', tokenVerify, contactsApi.deleteById)

	// Users
	.get('/users', tokenVerify, usersApi.getAll) // isSuperadmin
	.get('/users/:id', tokenVerify, usersApi.getById) // isSuperadmin || isOwner
	.put('/users/:id', tokenVerify, usersApi.updateById) // isSuperadmin || isOwner
	.delete('/users/:id', tokenVerify, usersApi.deleteById) // isSuperadmin || isOwner

	// Auth
	.post('/auth/login', authService.login)
	.post('/auth/register', authService.createUser)
	.get('/auth/me', tokenVerify, authService.getUserByToken);


//Add url prefix eg.'/api/v1'
app.use(config.version, router);


