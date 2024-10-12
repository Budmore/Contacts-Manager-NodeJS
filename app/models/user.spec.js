const mongoose = require('mongoose');
const User = require('./user');

describe('Models: user', () => {
	beforeAll(async () => {
		await mongoose.connect(process.env.MONGO_URI);
	});

	afterAll(async () => {
		await mongoose.disconnect();
	});

	beforeEach(async () => {
		await User.deleteMany();
	});

	it('should create and save a user successfully', async () => {
		const validUser = new User({
			email: 'test@example.com',
			password: 'securepassword123',
			phone: '1234567890',
			image: 'https://example.com/profile.png',
			notificationsTypes: {
				email: true,
				sms: false,
			},
			recipients: {
				emails: ['recipient1@example.com', 'recipient2@example.com'],
				phones: ['9876543210'],
			},
		});

		const savedUser = await validUser.save();

		expect(savedUser._id).toBeDefined();
		expect(savedUser.email).toBe(validUser.email);
		expect(savedUser.password).toBe(validUser.password);
	});
});
