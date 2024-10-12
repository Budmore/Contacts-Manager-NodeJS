const jwt = require('jsonwebtoken');
const { generateToken } = require('./token.utils');
const config = require('../../../config');

jest.mock('jsonwebtoken', () => ({
	sign: jest.fn(),
}));

describe('generateToken()', () => {
	it('should generate a token with the correct payload and options', () => {
		const mockUser = {
			_id: 'user123',
			email: 'test@example.com',
		};

		const expectedPayload = {
			_id: mockUser._id,
			email: mockUser.email,
		};
		const expectedOptions = {
			expiresIn: '24h',
		};
		const expectedToken = 'mockedToken';

		jwt.sign.mockReturnValue(expectedToken);

		const token = generateToken(mockUser);

		expect(jwt.sign).toHaveBeenCalledWith(
			expectedPayload,
			config.jwtSecret,
			expectedOptions
		);
		expect(token).toBe(expectedToken);
	});
});
