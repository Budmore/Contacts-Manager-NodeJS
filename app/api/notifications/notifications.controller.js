var cronJobs = require('../../services/cron-jobs/cron-jobs');
var mail = require('../../services/mail/mail');

var notificationsApi = {
	/**
	 * Check notifications to send across all users
	 *
	 * Method: GET
	 * http://budmore.pl/api/v1/users/
	 *
	 * @param  {object} req Request data
	 * @param  {object} res Respond data
	 * @return {array}
	 */
	checkAndSend: function (req, res) {
		cronJobs
			.checkAndSend()
			.then(function () {
				res.sendStatus(200);
			})
			.catch(function (error) {
				console.log('error', error);
			});
	},

	smtpVerifyConfig: function (req, res) {
		mail
			.smtpVerifyConfig()
			.then(function (result) {
				res.send(result);
			})
			.catch(function (error) {
				console.log('error', error);
			});
	},
};

module.exports = {
	checkAndSend: notificationsApi.checkAndSend,
	smtpVerifyConfig: notificationsApi.smtpVerifyConfig,
};
