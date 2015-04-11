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



var NodeCron = require('cron').CronJob;
var cronJobs = require('../app/services/cron-jobs');

var job = new NodeCron({
	cronTime: '00 00 06 * * *', // Runs every day at 6:00 AM
	onTick: function() {
		console.log('Cron job: tick');
		cronJobs.checkAndSend();

	},
	start: true
});



var server;
exports.start = function(port, callback) {
	server = app.listen(port, callback);
};
exports.stop = function(callback) {
	server.close(callback);
};


var ipaddr = process.env.OPENSHIFT_INTERNAL_IP;
var port = process.env.PORT || process.env.OPENSHIFT_INTERNAL_PORT || 9000;
app.listen(port, ipaddr, function() {
	//start cron jobs
	console.log('Cron job: start');
	job.start();
});



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
