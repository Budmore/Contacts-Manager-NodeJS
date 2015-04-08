// {last_updated: new Date('2014-01-22T14:56:59.301Z')

// collection.findOne({last_updated: new Date('2014-01-22T14:56:59.301Z')},function(err, doc

var assert = require('chai').assert;

var ContactModel = require('../../app/models/contact');
var service = require('../../app/services/birthdate-check');

describe('Service: birthdateCheck', function() {
	'use strict';

	var mockedContact = {
		firstname: 'Jakub',
		birthdate: {
			date: new Date(1987, 8, 11),
			year: 1987,
			month: 8,
			day: 11
		}
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



	it('should check is today birthdate', function(done) {

		var someDay = new Date(2015, 08, 11);


		service.birthdateCheck(someDay).then(function(data) {
			var dataDate = data[0].birthdate.date.toString();
			var mockedDate = mockedContact.birthdate.date.toString();

			assert.equal(dataDate, mockedDate);
			done();
		});

	});


});
