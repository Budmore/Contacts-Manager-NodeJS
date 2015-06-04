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

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:9000');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
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

router
	// Contacts
	.post('/contacts', contactsApi.create)
	.get('/contacts', contactsApi.getAll)
	.get('/contacts/:id', contactsApi.getById)
	.put('/contacts/:id', contactsApi.updateById)
	.delete('/contacts/:id', contactsApi.deleteById)

	// Users
	// @TODO: Restrict access for unauthorized users.
	.post('/users', usersApi.create)
	.get('/users', usersApi.getAll)
	.get('/users/:id', usersApi.getById)
	.put('/users/:id', usersApi.updateById)
	.delete('/users/:id', usersApi.deleteById)

	// Auth
	.post('/users/login', authService.login);
	// .get('/users/me', authService.validateToken);

//Add url prefix eg.'/api/v1'
app.use(config.version, router);


