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
var port = process.env.PORT || 9010;
mongoose.connect(config.db.development);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


if (!process.env.SPEC) {
	process.env[config.environment] = true; // Environment
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


