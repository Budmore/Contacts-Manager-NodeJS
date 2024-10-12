const jwt = require('jsonwebtoken');
const { tokenVerify } = require('./token-verify');
const config = require('../../config');

jest.mock('jsonwebtoken');

describe('tokenVerify', () => {
	let req;

	beforeEach(() => {
		req = {
			headers: {},
		};
	});

	it('should resolve if the token is valid', async () => {
		req.headers['authorization'] = 'Bearer validToken';

		jwt.verify.mockImplementation((token, secret, callback) => {
			callback(null, { id: 'userId123' });
		});

		await expect(tokenVerify(req)).resolves.toBeUndefined();
		expect(req.decoded).toEqual({ id: 'userId123' });
		expect(jwt.verify).toHaveBeenCalledWith(
			'validToken',
			config.jwtSecret,
			expect.any(Function)
		);
	});

	it('should reject if the token is invalid', async () => {
		req.headers['authorization'] = 'Bearer invalidToken';

		jwt.verify.mockImplementation((token, secret, callback) => {
			callback(new Error('Invalid token'), null);
		});

		await expect(tokenVerify(req)).rejects.toEqual({
			status: 401,
			message: new Error('Invalid token'),
		});
		expect(jwt.verify).toHaveBeenCalledWith(
			'invalidToken',
			config.jwtSecret,
			expect.any(Function)
		);
	});

	it('should reject if no token is provided', async () => {
		req.headers['authorization'] = undefined;

		await expect(tokenVerify(req)).rejects.toEqual({
			status: 403,
			message: 'No token provided.',
		});
		expect(jwt.verify).not.toHaveBeenCalled();
	});

	it('should reject if the token is malformed', async () => {
		req.headers['authorization'] = 'InvalidHeader';

		await expect(tokenVerify(req)).rejects.toEqual({
			status: 403,
			message: 'No token provided.',
		});
		expect(jwt.verify).not.toHaveBeenCalled();
	});
});
