var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ContactSchema = new Schema({
	name: String,
	firstname: String,
	lastname: String,
	nickname: String,
	notes: String,
	email: { type: String, unique: true },
	phone: String,
	skype: String,
	location: String,
	url: String,
	birthday: Date,
	nameday: Date,
	modified: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contact', ContactSchema);
