const validator = require('validator');

const { hashPassword, checkPassword, generateToken } = require('./auth.utils');
const UserModel = require('../users/users.model');

const auth = {
	/**
	 * Login user and generate JWT (JSON Web Token)
	 *
	 * @param  {object} req Request data
	 * @param  {object} res Respond data
	 * @return {Object}     JWT token
	 */
	login: async function (req, res) {
		try {
			const { email, password } = req.body;

			// Check for valid email and password input
			if (!email || !password || !validator.isEmail(email)) {
				return res.status(400).send({
					status: 400,
					message: 'Bad request',
				});
			}

			const user = await UserModel.findOne({ email: email })
				.select('_id password email')
				.exec();
			const isPasswordValid = await checkPassword(password, user?.password);

			if (user && isPasswordValid) {
				const result = {
					_id: user._id,
					email: user.email,
					token: generateToken(user),
				};
				return res.send(result);
			} else {
				return res.status(401).send({
					status: 401,
					message: 'Invalid credentials',
				});
			}
		} catch (err) {
			return res.status(500).send('Server error');
		}
	},

	/**
	 * Create new user, and generate JWT (JSON Web Token)
	 *
	 * Method: POST
	 * http://budmore.pl/api/v1/users/register
	 *
	 * @param {Object} req Request data
	 * @param {Object} res Respond data
	 * return {Object}     User with token
	 */
	createUser: async function (req, res) {
		try {
			// Email validate
			if (!validator.isEmail(req.body.email)) {
				return res.status(400).send('Please enter a valid email address.');
			}

			// Password validate
			if (
				!req.body.password ||
				!validator.isStrongPassword(req.body.password, { minLength: 6 })
			) {
				return res
					.status(400)
					.send('The password must be at least 6 characters');
			}

			const hashedPassword = await hashPassword(req.body.password);
			const _user = {
				email: req.body.email,
				password: hashedPassword,
				notificationsTypes: {
					email: true,
					sms: false,
				},
				recipients: {
					emails: [],
					phones: [],
				},
			};

			const createUser = new UserModel(_user);
			const user = await createUser.save();

			const userCopy = JSON.parse(JSON.stringify(user)); // Copy user object
			delete userCopy.password; // Remove hashed password
			userCopy.token = generateToken(user); // Generate token

			res.status(201).send(userCopy);
		} catch (err) {
			res.status(500).send('Server error');
		}
	},

	/**
	 * Get user data by token
	 *
	 * @param  {object} req Request data
	 * @param  {object} res Respond data
	 * @return {Object}     User object
	 */
	getUserByToken: async function (req, res) {
		try {
			const tokenID = req.decoded._id;

			// Check if the tokenID exists
			if (!tokenID) {
				return res.status(401).send('Unauthorized');
			}

			// Define the query to find the user by their token ID
			const query = {
				_id: tokenID,
			};

			// Await the UserModel.findOne() call to return the user or null
			const user = await UserModel.findOne(query).exec();

			if (!user) {
				return res.status(404).send('User not found');
			}

			// Return the user data
			return res.send(user);
		} catch (err) {
			// Handle any potential errors during the database query
			return res.status(500).send('Server error');
		}
	},
};

module.exports = {
	login: auth.login,
	createUser: auth.createUser,
	getUserByToken: auth.getUserByToken,
};
