const { hashPassword, checkPassword } = require('./auth.utils');

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
});
