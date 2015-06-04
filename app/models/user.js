var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	email: {type: String, maxlength: 254, required: true, unique: true },
	password: {type: String, maxlength: 128, minlength: 6, required: true },
	phone: {type: String, maxlength: 60},
	image: {type: String, maxlength: 2000},
	notificationsTypes: {
		email: Boolean,
		sms: Boolean
	},
	recipients: {
		emails: [{type: String,  maxlength: 254}],
		phones: [{type: String,  maxlength: 60}]
	}
});

module.exports = mongoose.model('User', UserSchema);
