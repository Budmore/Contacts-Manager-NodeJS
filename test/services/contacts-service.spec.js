var assert = require('chai').assert;

var ContactModel = require('../../app/models/contact');
var service = require('../../app/services/contacts/contacts-service');

describe('Service: contacts', function() {
	'use strict';

	var mockedContact = {
		firstname: 'Jakub',
		birthdate: {
			date: new Date(1987, 7, 11),
			year: 1987,
			month: 7,
			day: 11
		},
		dates: [
			{
				type: 'BIRTDATE',
				date: new Date(1987, 3, 11),
				year: 1987,
				month: 3,
				day: 11
			},
			{
				type: 'CUSTOM',
				date: new Date(2000, 3, 11),
				year: 2000,
				month: 3,
				day: 11
			}
		]
	};

	beforeEach('Create model with id (to test on it)',function(done) {

		var createContact = new ContactModel(mockedContact);

		createContact.save(function(err, doc) {
			assert.isNull(err);
			assert.ok(doc);
			assert.isObject(doc);
			done();
		});

	});


	it('should check is contacts has some event today', function(done) {

		var someDay = new Date(2015, 3, 11);


		service.findContactsByDate(someDay).then(function(data) {
			var datesLength = data[0].dates.length;
			var mockedDatesLength = mockedContact.dates.length;

			assert.equal(datesLength, mockedDatesLength);
			done();
		});

	});


});
