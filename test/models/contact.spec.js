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
			dates: [
				{
					type: 'BIRTHDATE',
					date: someDate,
					year: someDate.getFullYear(),
					month: someDate.getMonth(),
					day: someDate.getDate()
				}
			]
		};

		var createContact = new ContactModel(_contact);

		createContact.save(function(err, doc) {
			assert.isNull(err);
			assert.ok(doc);
			assert.isObject(doc);

			assert.equal(doc.name, _contact.name);
			assert.equal(doc.dates[0].date, someDate);

			done();
		});

	});

});
