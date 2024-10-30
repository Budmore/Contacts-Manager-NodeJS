const jwt = require('jsonwebtoken');
const config = require('../../../config');

jest.mock('jsonwebtoken', () => ({
	sign: jest.fn(),
}));

const { hashPassword, checkPassword, generateToken } = require('./auth.utils');

const plainPassword = 'mySecurePassword123';

describe('auth.utils', () => {
	describe('hashPassword()', () => {
		it('should hash a password', async () => {
			const hashedPassword = await hashPassword(plainPassword);
			expect(typeof hashedPassword).toBe('string');
			expect(hashedPassword.length).toBeGreaterThan(0);
		});

		it('should hash the password with bcrypt prefix', async () => {
			const hashedPassword = await hashPassword(plainPassword);
			expect(hashedPassword.startsWith('$2b$')).toBe(true); // bcrypt hashed strings typically start with "$2b$"
		});
	});

	describe('checkPassword()', () => {
		it('should return true when comparing correct password', async () => {
			const hashedPassword = await hashPassword(plainPassword);
			const isMatch = await checkPassword(plainPassword, hashedPassword);
			expect(isMatch).toBe(true);
		});

		it('should return false when comparing incorrect password', async () => {
			const hashedPassword = await hashPassword(plainPassword);
			const wrongPassword = 'wrongPassword!';
			const isMatch = await checkPassword(wrongPassword, hashedPassword);
			expect(isMatch).toBe(false);
		});
	});

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
});
