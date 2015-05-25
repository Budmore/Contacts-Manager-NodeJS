'use strict';
var express = require('express');
var port = 9010;
var app = express();

// parse urlencoded request bodies into req.body
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database
var mongoose = require('mongoose');
var config = require('../config');
mongoose.connect(config.db.development);


// Environment
process.env[config.environment] = true;

// Server
var server;
var start = exports.start = function(port, callback) {
	server = app.listen(port, callback);
};
exports.stop = function(callback) {
	server.close(callback);
};


//
// Cron jobs
// Runs every day at 6:00 AM - crontab.org
//
var NodeCron = require('cron').CronJob;
var cronJobs = require('../app/services/cron-jobs');
new NodeCron({
	cronTime: '00 00 06 * * *',
	onTick: function() {
		console.log('Cron job: tick');
		cronJobs.checkAndSend();

	},
	start: true
});


if (process.env.DEVELOPMENT) {
	start(port, function() {
		console.log('working');
	});
}






// MIDDLEWARES
// -----------------------------------------------------------------------------

//CORS
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
var api = require('./api/contacts-api');


router.get('/', function(req, res) {
	res.send('isAlive');
});

router
	// Contacts
	.post('/contacts', api.create)
	.get('/contacts', api.getAll)
	.get('/contacts/:id', api.getById)
	.put('/contacts/:id', api.updateById)
	.delete('/contacts/:id', api.deleteById);



app.use('/api/v1', router);



