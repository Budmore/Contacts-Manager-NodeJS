var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ContactSchema = new Schema({
	_userid: {type: String, require: true},
	name: String,
	firstname: String,
	lastname: String,
	nickname: String,
	notes: String,
	email: { type: String },
	phone: String,
	skype: String,
	location: String,
	url: String,
	dates: [{
		type: {
			type: String
		},
		date: Date,
		year: Number,
		month: Number,
		day: Number
	}],
	modified: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contact', ContactSchema);
