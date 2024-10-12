const mongoose = require('mongoose');
const ContactModel = require('./contact');

describe('Models: contact', function () {
	beforeAll(async () => {
		await mongoose.connect(process.env.MONGO_URI);
	});

	afterAll(async () => {
		await mongoose.disconnect();
	});

	beforeEach(async () => {
		await ContactModel.deleteMany();
	});

	it('should create new contact', async () => {
		const someDate = new Date();

		const validContact = new ContactModel({
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
					day: someDate.getDate(),
				},
			],
		});

		const savedContact = await validContact.save();

		expect(savedContact.name).toBe(validContact.name);
		expect(savedContact.dates[0].date).toBe(someDate);
	});
});
