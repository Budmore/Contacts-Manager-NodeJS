'use strict';
var assert = require('chai').assert;
var mongoose = require('mongoose');
var ContactModel = require('../../../app/models/contact');
var contactsService = require('./contacts-service');

describe('Service: contacts', function () {
	var mockedUser = {
		_id: mongoose.Types.ObjectId()
	};

	var mockedContact = {
		_userid: mockedUser._id,
		firstname: 'Jakub',
		dates: [
			{
				type: 'BIRTHDATE',
				date: new Date(1987, 7, 11),
				year: 1987,
				month: 7,
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

	var mockedContact2 = {
		_userid: mockedUser._id,
		firstname: 'Bobek',
		dates: [
			{
				type: 'BIRTHDATE',
				date: new Date(1987, 6, 30),
				year: 1987,
				month: 6,
				day: 30
			}
		]
	};

	var mockedContact3 = {
		_userid: mockedUser._id,
		firstname: 'Jolek',
		dates: [
			{
				type: 'BIRTHDATE',
				date: new Date(1987, 3, 27),
				year: 1987,
				month: 3,
				day: 27
			}
		]
	};

	var mockedContact4 = {
		_userid: 'random41b9612e42e2fc440dd',
		firstname: 'Lolek',
		dates: [
			{
				type: 'BIRTHDATE',
				date: new Date(1987, 3, 27),
				year: 1987,
				month: 3,
				day: 27
			}
		]
	};

	var mockedContact5 = {
		_userid: 'random41b9612e42e2fc440dd',
		firstname: 'Lolek',
		dates: [
			{
				type: 'BIRTHDATE',
				date: new Date(1987, 4, 1),
				year: 1987,
				month: 4,
				day: 1
			}
		]
	};


	beforeEach('Create model with id (to test on it)', function (done) {

		var newContacts = [mockedContact, mockedContact2, mockedContact3, mockedContact4, mockedContact5];

		ContactModel.create(newContacts, function (err, contacts) {
			assert.isNull(err);
			assert.ok(contacts);

			assert.isArray(contacts);
			done();
		});

	});


	it('should findContactsByDate() - check is contacts has some event today', function (done) {

		var _userid = mockedContact._userid;
		var someDay = mockedContact.dates[0].date;

		contactsService.findContactsByDate(_userid, someDay).then(function (contacts) {
			var datesLength = contacts[0].dates.length;
			var mockedDatesLength = mockedContact.dates.length;

			assert.equal(datesLength, mockedDatesLength - 1);
			done();
		});

	});

	it('should parseDates() - set property year, month, day from each date in dates.', function (done) {

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

	it('should findAllContactsByDateRange()', function (done) {
		var startDate = new Date('2018-06-25');
		var endDate = new Date('2018-08-11');
		var userId = mockedUser._id;


		contactsService.findAllContactsByDateRange(userId, startDate, endDate)
			.then(function (data) {
				assert.equal(data.length, 2);
				done();
			});

	});

	describe('findContactsByDateForAllUsers()', function () {
		it('should get contacts accross multiple users', function (done) {
			// GIVEN
			var specificDate = new Date(1987, 3, 27);


			// WHEN
			contactsService.findContactsByDateForAllUsers(specificDate)
				.then(function (data) {
					// THEN
					assert.equal(data.length, 2);
					assert.notEqual(data[0]._userid, data[1]._userid);
					done();
				});

		});
	});

	describe('findAllContactsByDateRangeForAllUsers', function () {
		it('should get contacts accross muliple users and days', function (done) {
			// GIVEN
			var startDate = new Date(1987, 3, 27);
			var endDate = new Date(1987, 4, 1);


			// WHEN
			contactsService.findAllContactsByDateRangeForAllUsers(startDate, endDate)
				.then(function (data) {
					// THEN
					assert.equal(data.length, 3);

					done();
				});
		});
	});
});
