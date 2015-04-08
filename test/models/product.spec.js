var assert = require('chai').assert;

var ContactModel = require('../../app/models/contact');

describe('Models: contact', function() {
	'use strict';

	it('should create new contact', function(done) {
		var someDate = new Date();

		var _contact = {
			firstname: 'Jakub',
			lastname: 'Mach',
			nickname: 'Budmore',
			notes: 'is Awesome!',
			email: 'j.mach@budmore.pl',
			url: 'http://budmore.pl',
			birthdate: {
				date: someDate,
				year: someDate.getYear()
			}
		};

		var createContact = new ContactModel(_contact);

		createContact.save(function(err, contact) {
			assert.isNull(err);
			assert.ok(contact);
			assert.isObject(contact);
			assert.equal(contact.name, _contact.name);
			assert.equal(contact.birthdate.date, someDate);
			done();
		});

	});

});
