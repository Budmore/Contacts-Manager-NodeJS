const validator = require('validator');
const authController = require('./auth.controller');
const UserModel = require('../users/users.model');
const { checkPassword, hashPassword, generateToken } = require('./auth.utils');

jest.mock('validator', () => ({
	isEmail: jest.fn(),
	isStrongPassword: jest.fn(),
}));
jest.mock('../users/users.model');
jest.mock('./auth.utils');

describe('Login Service', () => {
	let req;
	let res;

	beforeEach(() => {
		req = { body: {}, decoded: {} };
		res = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn(),
		};
		jest.clearAllMocks();
	});

	describe('login()', () => {
		it('should return 400 if email or password is missing', async () => {
			req.body = { email: '', password: '' };

			await authController.login(req, res);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.send).toHaveBeenCalledWith({
				status: 400,
				message: 'Bad request',
			});
		});

		it('should return 400 if email is not valid', async () => {
			req.body = { email: 'invalid-email', password: 'password123' };

			await authController.login(req, res);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.send).toHaveBeenCalledWith({
				status: 400,
				message: 'Bad request',
			});
		});

		it('should return 401 if the user has not be found', async () => {
			req.body = { email: 'user@example.com', password: 'password123' };
			validator.isEmail.mockReturnValue(true);
			const mockUser = null;
			const execMock = jest.fn().mockResolvedValue(mockUser);
			const selectMock = jest.fn().mockReturnValue({ exec: execMock });
			UserModel.findOne = jest.fn().mockReturnValue({ select: selectMock });

			await authController.login(req, res);

			expect(res.status).toHaveBeenCalledWith(401);
			expect(res.send).toHaveBeenCalledWith({
				status: 401,
				message: 'Invalid credentials',
			});
		});

		it('should return 401 if the user provide incorrect password', async () => {
			validator.isEmail.mockReturnValue(true);
			req.body = { email: 'user@example.com', password: 'password123' };
			const mockUser = { password: 'hashedPassword' };

			const execMock = jest.fn().mockResolvedValue(mockUser);
			const selectMock = jest.fn().mockReturnValue({ exec: execMock });
			const findOneMock = jest.fn().mockReturnValue({ select: selectMock });
			UserModel.findOne = findOneMock;

			checkPassword.mockReturnValue(false);

			await authController.login(req, res);

			expect(res.status).toHaveBeenCalledWith(401);
			expect(checkPassword).toHaveBeenCalledWith(
				'password123',
				'hashedPassword'
			);
		});

		it('should return the user data with a token when user credentials are correct', async () => {
			validator.isEmail.mockReturnValue(true);
			req.body = { email: 'user@example.com', password: 'password123' };
			const mockUser = {
				_id: 'mock-id',
				email: 'mock-email',
				password: 'hashedPassword',
			};

			const execMock = jest.fn().mockResolvedValue(mockUser);
			const selectMock = jest.fn().mockReturnValue({ exec: execMock });
			const findOneMock = jest.fn().mockReturnValue({ select: selectMock });
			UserModel.findOne = findOneMock;

			generateToken.mockReturnValue('mock-token');
			checkPassword.mockReturnValue(true);

			await authController.login(req, res);

			expect(res.send).toHaveBeenCalledWith({
				_id: 'mock-id',
				email: 'mock-email',
				token: 'mock-token',
			});
		});

		it('should return 500 if there is a server error', async () => {
			validator.isEmail.mockReturnValue(true);
			req.body = { email: 'user@example.com', password: 'password123' };

			UserModel.findOne.mockReturnValue({
				exec: jest.fn().mockRejectedValue(new Error('Database error')), // Simulating a server error
			});

			await authController.login(req, res);

			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.send).toHaveBeenCalledWith('Server error');
		});
	});

	describe('createUser', () => {
		it('should return 400 if email is invalid', async () => {
			validator.isEmail.mockReturnValue(false);

			await authController.createUser(req, res);

			expect(validator.isEmail).toHaveBeenCalledWith(req.body.email);
			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.send).toHaveBeenCalledWith(
				'Please enter a valid email address.'
			);
		});

		it('should return 400 when email is valid but isStrongPassword() returns false', async () => {
			validator.isEmail.mockReturnValue(true);
			validator.isStrongPassword.mockReturnValue(false);

			req.body.password = 'mock';
			await authController.createUser(req, res);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.send).toHaveBeenCalledWith(
				'The password must be at least 6 characters'
			);
		});

		it('should create a new user with a specific payload', async () => {
			validator.isEmail.mockReturnValue(true);
			validator.isStrongPassword.mockReturnValue(true);
			hashPassword.mockReturnValue('hashedPassword');

			req.body.email = 'mock-email';
			req.body.password = 'mock-password';

			await authController.createUser(req, res);

			expect(hashPassword).toHaveBeenCalledWith(req.body.password);
			expect(UserModel).toHaveBeenCalledWith({
				email: req.body.email,
				password: 'hashedPassword',
				notificationsTypes: { email: true, sms: false },
				recipients: { emails: [], phones: [] },
			});
		});

		it('should create a new user and return 201 with user data excluding password', async () => {
			validator.isEmail.mockReturnValue(true);
			validator.isStrongPassword.mockReturnValue(true);
			hashPassword.mockReturnValue('hashedPassword');
			generateToken.mockReturnValue('mock-token');

			const mockUser = {
				email: 'test@example.com',
				password: 'hiddenPassword',
			};
			const mockSave = jest.fn().mockResolvedValue(mockUser);
			UserModel.mockImplementation(() => {
				return { save: mockSave };
			});

			req.body.email = 'mock-email';
			req.body.password = 'mock-password';

			await authController.createUser(req, res);

			expect(res.status).toHaveBeenCalledWith(201);
			expect(res.send).toHaveBeenCalledWith({
				email: 'test@example.com',
				token: 'mock-token',
			});
		});

		it('should handle errors and return 500 if there is an error', async () => {
			validator.isEmail.mockReturnValue(true);
			validator.isStrongPassword.mockReturnValue(true);
			req.body.password = 'mock-password';

			const error = new Error('Test error');
			UserModel.mockImplementation(() => ({
				save: jest.fn().mockRejectedValue(error),
			}));

			await authController.createUser(req, res);

			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.send).toHaveBeenCalledWith('Server error');
		});
	});

	describe('getUserByToken()', () => {
		it('should return 401 if tokenID is missing', async () => {
			req.decoded._id = null;

			await authController.getUserByToken(req, res);

			expect(res.status).toHaveBeenCalledWith(401);
			expect(res.send).toHaveBeenCalledWith('Unauthorized');
		});

		it('should return 404 if user is not found', async () => {
			req.decoded._id = 'someUserId';
			UserModel.findOne.mockReturnValue({
				exec: jest.fn().mockResolvedValue(null), // Simulating user not found
			});

			await authController.getUserByToken(req, res);

			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.send).toHaveBeenCalledWith('User not found');
		});

		it('should return the user if user is found', async () => {
			const mockUser = { _id: 'mock-id', name: 'Mock name' };
			req.decoded._id = 'someUserId';
			UserModel.findOne.mockReturnValue({
				exec: jest.fn().mockResolvedValue(mockUser), // Simulating a found user
			});

			await authController.getUserByToken(req, res);

			expect(res.send).toHaveBeenCalledWith(mockUser);
		});

		it('should return 500 if there is a server error', async () => {
			req.decoded._id = 'someUserId';
			UserModel.findOne.mockReturnValue({
				exec: jest.fn().mockRejectedValue(new Error('Database error')), // Simulating a server error
			});

			await authController.getUserByToken(req, res);

			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.send).toHaveBeenCalledWith('Server error');
		});
	});
});
