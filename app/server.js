var express = require('express');
var port = 9010;
var app = express();

var server;

var start = exports.start = function(port, callback) {
	server = app.listen(port, callback);
};

var stop = exports.stop = function(callback) {
	server.close(callback);
};


var router = express.Router();
router.get('/', function(req, res) {
	res.send('isAlive');
});


app.use('/api/v1', router);
