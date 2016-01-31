var assert          = require('chai').assert;
var ContactModel    = require('../../app/models/contact');
var contactsService = require('../../app/services/contacts/contacts-service');

describe('Service: contacts', function() {
	'use strict';

	var mockedContact = {
		_userid: '5582d41b9612e42e2fc440dd',
		firstname: 'Jakub',
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
				month: 6,
				day: 11
			}
		]
	};

	var mockedContact2 = {
		_userid: '5582d41b9612e42e2fc440dd',
		firstname: 'Bobek',
		dates: [
			{
				type: 'BIRTDATE',
				date: new Date(1987, 3, 16),
				year: 1987,
				month: 3,
				day: 16
			}
		]
	};

	var mockedContact3 = {
		firstname: 'Lolek',
		dates: [
			{
				type: 'BIRTDATE',
				date: new Date(1987, 3, 12),
				year: 1987,
				month: 3,
				day: 12
			}
		]
	};

	beforeEach('Create model with id (to test on it)',function(done) {

		var newContacts = [mockedContact, mockedContact2, mockedContact3];

		ContactModel.create(newContacts, function(err, contacts) {
			assert.isNull(err);
			assert.ok(contacts);
			assert.isArray(contacts);
			done();
		});

	});


	it('should findContactsByDate() - check is contacts has some event today', function(done) {

		var _userid = mockedContact._userid;
		var someDay = new Date(2015, 3, 11);

		contactsService.findContactsByDate(_userid, someDay).then(function(data) {
			var datesLength = data[0].dates.length;
			var mockedDatesLength = mockedContact.dates.length;

			assert.equal(datesLength, mockedDatesLength - 1);
			done();
		});

	});

	it('should parseDates() - set property year, month, day from each date in dates.', function(done) {

		var someDate = new Date();

		var _contact = {
			dates: [
				{
					type: 'BIRTHDATE',
					date: someDate
				},
				{
					type: 'EVENT',
					date: someDate
				}
			]
		};

		var someYear = someDate.getFullYear();
		var someMonth = someDate.getMonth();
		var someDay = someDate.getDate();


		contactsService.parseDates(_contact.dates);

		assert.equal(_contact.dates[0].year, someYear);
		assert.equal(_contact.dates[1].month, someMonth);
		assert.equal(_contact.dates[0].day, someDay);


		assert.equal(_contact.dates[1].year, someYear);
		assert.equal(_contact.dates[1].month, someMonth);
		assert.equal(_contact.dates[1].day, someDay);

		done();
	});

	it('should findAllContactsByDateRange()', function(done) {
		var startDate = new Date(2015, 3, 11);
		var endDate = new Date(2015, 3, 16);

		contactsService.findAllContactsByDateRange(startDate, endDate)
			.then(function(data) {
				assert.equal(data.length, 3); //mocdkedContact + mockedContact2 + mocdkedContact3
				done();
			});

	});
});
