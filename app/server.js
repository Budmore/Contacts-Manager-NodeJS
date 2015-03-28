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
var ContactModel = require('../app/models/contact');


var server;
var start = exports.start = function(port, callback) {
	server = app.listen(port, callback);
};
var stop = exports.stop = function(callback) {
	server.close(callback);
};


// ROUTES
// -----------------------------------------------------------------------------

var router = express.Router();
router.get('/', function(req, res) {
	res.send('isAlive');
});

router.route('/contacts')
	.get(function(req, res) {

		ContactModel.find({}, function(err, doc) {
			if (err) {
				return res.status(500).send(err);
			}

			res.json(doc);
		});

	})

	.post(function(req, res) {

		var _contact = {
			firstname: req.body.firstname,
			lastname: req.body.lastname,
			nickname: req.body.nickname,
			notes: req.body.notes,
			email: req.body.email,
			url: req.body.url,
			birthday: req.body.birthday,
			nameday: req.body.nameday
		};

		var createContact = new ContactModel(_contact);

		createContact.save(function(err, doc) {
			if (err) {
				return res.status(500).send(err);
			}

			res.send(doc);

		});

	});

router.route('/contacts/:id')

	.get(function(req, res) {
		var _id = req.params.id;

		ContactModel.findById(_id, function(err, doc) {
			if (err) {
				return res.status(500).send(err);
			}

			res.send(doc);
		});

	})

	.put(function(req, res) {

		var _id = req.params.id;

		var updatedContact = req.body;
		delete updatedContact._id;


		ContactModel.findByIdAndUpdate(_id, {$set: updatedContact}, function(err, doc) {
			if (err) {
				return res.status(500).send(err);
			}

			res.send(doc);

		});

	})

	.delete(function(req, res) {
		var _id = req.params.id;

		ContactModel.findByIdAndRemove(_id, function(err, doc) {
			if (err) {
				return res.status(500).send(err);
			}

			res.status(200).send();
		});

	});



app.use('/api/v1', router);
