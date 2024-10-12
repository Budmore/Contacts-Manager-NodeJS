'use strict';
var mongoose = require('mongoose');
var ContactModel = require('../../../app/models/contact');
var contactsService = require('./contacts-service');

describe('Service: contacts', function () {
	var mockedUser = {
		_id: new mongoose.Types.ObjectId(),
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
				day: 11,
			},
			{
				type: 'CUSTOM',
				date: new Date(2000, 3, 11),
				year: 2000,
				month: 3,
				day: 11,
			},
		],
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
				day: 30,
			},
		],
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
				day: 27,
			},
		],
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
				day: 27,
			},
		],
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
				day: 1,
			},
		],
	};

	beforeAll(async () => {
		await mongoose.connect(process.env.MONGO_URI);
	});

	afterAll(async () => {
		await mongoose.disconnect();
	});

	beforeEach(async () => {
		await ContactModel.deleteMany();
	});

	beforeEach(async () => {
		const newContacts = [
			mockedContact,
			mockedContact2,
			mockedContact3,
			mockedContact4,
			mockedContact5,
		];
		const contacts = await ContactModel.create(newContacts);
		expect(contacts).toBeTruthy();
		expect(Array.isArray(contacts)).toBe(true);
	});

	it('should findContactsByDate() - check is contacts has some event today', async () => {
		const _userid = mockedContact._userid;
		const someDay = mockedContact.dates[0].date;

		const contacts = await contactsService.findContactsByDate(_userid, someDay);

		const datesLength = contacts[0].dates.length;
		const mockedDatesLength = mockedContact.dates.length;

		expect(datesLength).toBe(mockedDatesLength - 1);
	});

	it('should parseDates() - set property year, month, day from each date in dates.', () => {
		const someDate = new Date();

		const _contact = {
			dates: [
				{
					type: 'BIRTHDATE',
					date: someDate,
				},
				{
					type: 'EVENT',
					date: someDate,
				},
			],
		};

		const someYear = someDate.getFullYear();
		const someMonth = someDate.getMonth();
		const someDay = someDate.getDate();

		contactsService.parseDates(_contact.dates);

		expect(_contact.dates[0].year).toBe(someYear);
		expect(_contact.dates[1].month).toBe(someMonth);
		expect(_contact.dates[0].day).toBe(someDay);

		expect(_contact.dates[1].year).toBe(someYear);
		expect(_contact.dates[1].month).toBe(someMonth);
		expect(_contact.dates[1].day).toBe(someDay);
	});

	it('should findAllContactsByDateRange()', async () => {
		const startDate = new Date('2018-06-25');
		const endDate = new Date('2018-08-11');
		const userId = mockedUser._id;

		const data = await contactsService.findAllContactsByDateRange(
			userId,
			startDate,
			endDate
		);
		expect(data.length).toBe(2);
	});

	describe('findContactsByDateForAllUsers()', () => {
		it('should get contacts across multiple users', async () => {
			const specificDate = new Date(1987, 3, 27);

			const data =
				await contactsService.findContactsByDateForAllUsers(specificDate);

			expect(data.length).toBe(2);
			expect(data[0]._userid).not.toBe(data[1]._userid);
		});
	});

	describe('findAllContactsByDateRangeForAllUsers', () => {
		it('should get contacts across multiple users and days', async () => {
			const startDate = new Date(1987, 3, 27);
			const endDate = new Date(1987, 4, 1);

			const data = await contactsService.findAllContactsByDateRangeForAllUsers(
				startDate,
				endDate
			);
			expect(data.length).toBe(3);
		});
	});
});
