var { Schema, model } = require('mongoose');

var UserSchema = new Schema({
	email: { type: String, maxlength: 254, required: true, unique: true },
	password: { type: String, required: true, select: false },
	phone: { type: String, maxlength: 60 },
	image: { type: String, maxlength: 2000 },
	notificationsTypes: {
		email: Boolean,
		sms: Boolean,
	},
	recipients: {
		emails: [{ type: String, maxlength: 254 }],
		phones: [{ type: String, maxlength: 60 }],
	},
});

module.exports = model('User', UserSchema);
