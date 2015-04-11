'use strict';
var assert = require('chai').assert;

var ContactModel = require('../../app/models/contact');
var cronJobs = require('../../app/services/cron-jobs');

describe('Service: cronJobs', function() {

	var mockedContact = {
		firstname: 'Jakub2',
		birthdate: {
			date: new Date(1987, 3, 9),
			year: 1987,
			month: 3,
			day: 9
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



	it('should send email if someone has birthday', function(done) {

		cronJobs.checkAndSend().then(function() {
			done();

		});
		// cronJobs.checkAndSend().then(function(data) {
		// 	console.log('checkAndSend', data);
		//  done();
		// });


		// service.birthdateCheck(someDay).then(function(data) {
		// 	var dataDate = data[0].birthdate.date.toString();
		// 	var mockedDate = mockedContact.birthdate.date.toString();

		// 	assert.equal(dataDate, mockedDate);
		// 	done();
		// });

	});


});
