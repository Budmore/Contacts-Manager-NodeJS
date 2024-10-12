'use strict';
var mongoose = require('mongoose');

var UserModel = require('../../../app/models/user');
var ContactModel = require('../../../app/models/contact');
var cronJobs = require('./cron-jobs');

describe('Service: cronJobs', function () {
	var mockedId = new mongoose.Types.ObjectId();
	var mockedId2 = new mongoose.Types.ObjectId();

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
					day: 30,
				},
				{
					type: 'CUSTOM',
					date: new Date(2000, 3, 11),
					year: 2000,
					month: 3,
					day: 11,
				},
			],
		},
		{
			_userid: mockedId,
			firstname: 'Bobek',
			dates: [
				{
					type: 'BIRTDATE',
					date: new Date(1987, 10, 1),
					year: 1987,
					month: 10,
					day: 1,
				},
			],
		},
		{
			_userid: mockedId2,
			firstname: 'Jakub 2',
			dates: [
				{
					type: 'CUSTOM',
					date: new Date(2000, 9, 28),
					year: 2000,
					month: 9,
					day: 28,
				},
			],
		},
	];

	var mockedUsers = [
		{
			_id: mockedId,
			email: 'jk.morgan@gmail.com',
			password: 'pritty#3strong)(password',
			notificationsTypes: {
				email: true,
			},
			recipients: {
				emails: ['test@budmore.pl', 'test1@budmore.pl'],
			},
		},
		{
			_id: mockedId2,
			email: 'jakub@budmore.pl',
			password: 'pritty#3strong)(password',
			notificationsTypes: {
				email: true,
			},
			recipients: {
				emails: ['jakub@budmore.pl'],
			},
		},
	];

	beforeAll(async () => {
		await mongoose.connect(process.env.MONGO_URI);
	});

	afterAll(async () => {
		await mongoose.disconnect();
	});

	beforeEach(async () => {
		await UserModel.deleteMany();
		await ContactModel.deleteMany();
		const users = await UserModel.insertMany(mockedUsers);
		const contacts = await ContactModel.insertMany(mockedContacts);
		expect(users).toBeDefined();
		expect(contacts).toBeDefined();
	});

	describe('getContacts()', () => {
		it('should get contact across all users', async () => {
			// GIVEN
			var startDate = new Date(2019, 9, 27);

			// WHEN
			const contacts = await cronJobs.getContacts(startDate);
			expect(contacts.length).toBe(3);
		});
	});

	describe('sortContactsByUser()', () => {
		it('should sort contacts by user', async () => {
			var contacts = Object.assign([], mockedContacts);

			const result = await cronJobs.sortContactsByUser(contacts);

			expect(result.contacts[mockedId].length).toEqual(2);
			expect(result.contacts[mockedId2].length).toEqual(1);
		});
	});

	describe('getUsers()', () => {
		it('should get detail information about users', async () => {
			var sortContactsByUserResult = {
				_userids: [mockedId, mockedId2],
			};

			await cronJobs.getUsers(sortContactsByUserResult);

			expect(sortContactsByUserResult.users.length).toEqual(2);
		});
	});
});
