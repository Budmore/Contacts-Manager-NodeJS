'use strict';
var assert = require('chai').assert;
var mongoose = require('mongoose');

var UserModel = require('../../../app/models/user');
var ContactModel = require('../../../app/models/contact');
var cronJobs = require('./cron-jobs');

describe('Service: cronJobs', function () {
	var mockedId = mongoose.Types.ObjectId();
	var mockedId2 = mongoose.Types.ObjectId();

	var mockedContacts = [
		{
			_userid: mockedId,
			firstname: 'Jakub',
			dates: [
				{
					type: 'BIRTDATE',
					date: new Date(1987, 9, 30),
					year: 1987,
					month: 9,
					day: 30
				},
				{
					type: 'CUSTOM',
					date: new Date(2000, 3, 11),
					year: 2000,
					month: 3,
					day: 11
				}
			]
		}, {
			_userid: mockedId,
			firstname: 'Bobek',
			dates: [
				{
					type: 'BIRTDATE',
					date: new Date(1987, 10, 1),
					year: 1987,
					month: 10,
					day: 1
				}
			]
		}, {
			_userid: mockedId2,
			firstname: 'Jakub 2',
			dates: [
				{
					type: 'CUSTOM',
					date: new Date(2000, 9, 28),
					year: 2000,
					month: 9,
					day: 28
				}
			]
		}
	];

	var mockedUsers = [
		{
			_id: mockedId,
			email: 'jk.morgan@gmail.com',
			password: 'pritty#3strong)(password',
			notificationsTypes: {
				email: true
			},
			recipients: {
				emails: ['test@budmore.pl', 'test1@budmore.pl']

			}
		}, {
			_id: mockedId2,
			email: 'jakub@budmore.pl',
			password: 'pritty#3strong)(password',
			notificationsTypes: {
				email: true
			},
			recipients: {
				emails: ['jakub@budmore.pl']

			}
		}
	];

	beforeEach('Create users (to test on it)', function (done) {
		var createUser = new UserModel();

		createUser.collection.insertMany(mockedUsers, function (err, user) {
			assert.isNull(err);
			assert.ok(user);
			done();
		});

	});



	beforeEach('Create contacts with _userid (to test on it)', function (done) {
		var createContact = new ContactModel();

		createContact.collection.insertMany(mockedContacts, function (err, contacts) {
			assert.isNull(err);
			assert.ok(contacts);
			done();
		});

	});

	describe('getContacts()', function () {
		it('should get contact across all users', function (done) {
			// GIVEN
			var startDate = new Date(2019, 9, 27);

			// WHEN
			cronJobs.getContacts(startDate).then(function (result) {
				// THEN
				assert.equal(result.length, 3);
				done();
			});
		});
	});

	describe('sortContactsByUser()', function () {
		it('should ', function (done) {
			// GIVEN
			var contacts = Object.assign([], mockedContacts);

			// WHEN
			cronJobs.sortContactsByUser(contacts).then(function (result) {
				// THEN
				assert(result.contacts[mockedId].length, 2);
				assert(result.contacts[mockedId2].length, 1);
				done();
			});
		});
	});

	describe('getUsers()', function () {
		it('should get deailt inforamtion about users', function () {
			// GIVEN
			var sortContactsByUserResult = {
				_userids: [mockedId, mockedId2]
			};
			// WHEN
			cronJobs.getUsers(sortContactsByUserResult).then(function (result) {
				// THEN
				assert(sortContactsByUserResult.users.length, 2);
			});
		});
	});
});
