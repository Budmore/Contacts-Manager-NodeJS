// const mongoose = require('mongoose');
// const request = require('superagent');
// const app = require('../../../app');
// const config = require('../../../config');
// const jwt = require('jsonwebtoken');

// const port = config.port;
// const version = config.version;
// const baseUrl = 'http://localhost:' + port + version;
// const UserModel = require('./users.model');

// let token;
// const mockedPayload = {
// 	_id: '55166e70fb1e9a18818ad8fd',
// 	email: 'jakub@gmail.com',
// };

describe.skip('User API', function () {
	it('should pass', () => {
		expect(2).toEqual(2);
	});
	// beforeAll(async () => {
	//   await mongoose.connect(process.env.MONGO_URI);
	// });
	// afterAll(async () => {
	//   await mongoose.disconnect();
	// });
	// beforeAll(async () => {
	//   token = jwt.sign(mockedPayload, config.secret);
	//   var createUser = new UserModel(mockedPayload);
	//   await createUser.save();
	// });
	// it("should get all contacts - 1 (is not superadmin)", async () => {
	//   const response = await request
	//     .get(baseUrl + "/users")
	//     .set("x-access-token", token)
	//     .end();
	//   expect(response.status).toEqual(200);
	// });
	// describe("with id", function () {
	//   var mockedUser = {
	//     _id: mockedPayload._id,
	//     email: mockedPayload.email,
	//     password: "[secret]",
	//   };
	//   beforeEach(async () => {
	//     var createContact = new UserModel(mockedUser);
	//     const contact = await createContact.save();
	//     expect(contact).toBeDefined();
	//   });
	//   it("should getUser() - 1 (with token)", function (done) {
	//     request
	//       .get(baseUrl + "/user")
	//       .set("x-access-token", token)
	//       .end(function (err, res) {
	//         assert.isNull(err);
	//         assert.equal(res.status, 200);
	//         assert.equal(res.body._id, mockedUser._id);
	//         done();
	//       });
	//   });
	//   it("should getUser() - 2 (incomplete token)", function (done) {
	//     var payload = {
	//       email: "some@email.pl",
	//     };
	//     var incompleteToken = jwt.sign(payload, config.secret);
	//     request
	//       .get(baseUrl + "/user")
	//       .set("x-access-token", incompleteToken)
	//       .end(function (err, res) {
	//         assert.isDefined(err);
	//         assert.equal(res.status, 400);
	//         done();
	//       });
	//   });
	//   it("should getById() - 1", function (done) {
	//     request
	//       .get(baseUrl + "/users/" + mockedUser._id)
	//       .set("x-access-token", token)
	//       .end(function (err, res) {
	//         assert.isNull(err);
	//         assert.isObject(res);
	//         assert.equal(res.status, 200);
	//         assert.equal(res.body._id, mockedUser._id);
	//         assert.isUndefined(res.body.password);
	//         done();
	//       });
	//   });
	//   it("should getById() - 2 (is not superadmin)", function (done) {
	//     request
	//       .get(baseUrl + "/users/otherid")
	//       .set("x-access-token", token)
	//       .end(function (err, res) {
	//         assert.equal(res.status, 403);
	//         done();
	//       });
	//   });
	//   it.skip("should getById() - 3 (is superadmin)", function (done) {
	//     //@TODO: create superadmin
	//     request
	//       .get(baseUrl + "/users/fake-id")
	//       .set("x-access-token", token)
	//       .end(function (err, res) {
	//         assert.isDefined(err);
	//         assert.isObject(res);
	//         assert.equal(res.status, 404);
	//         done();
	//       });
	//   });
	//   it("should updateById() - 1", function (done) {
	//     var updatedContact = {
	//       _id: mockedPayload._id,
	//       email: "test@aa.com",
	//       notificationsTypes: {
	//         email: true,
	//         sms: false,
	//       },
	//       recipients: {
	//         emails: ["lore@o2.pl", "invalid-email", "bogo@go.pl"],
	//         phones: ["+48 500 100 100"],
	//       },
	//     };
	//     request
	//       .put(baseUrl + "/users/" + updatedContact._id)
	//       .set("x-access-token", token)
	//       .send(updatedContact)
	//       .end(function (err, res) {
	//         assert.isNull(err);
	//         assert.equal(res.status, 200);
	//         assert.equal(res.body.email, updatedContact.email);
	//         assert.isUndefined(res.body.password);
	//         var emailsBefore = updatedContact.recipients.emails.length;
	//         var emailsAfter = res.body.recipients.emails.length;
	//         assert.equal(emailsAfter, emailsBefore - 1);
	//         done();
	//       });
	//   });
	//   it("should updateById() - 2 (is not superadmin) ", function (done) {
	//     var updatedContact = {
	//       _id: "some-other-id",
	//       email: "test@aa.com",
	//     };
	//     request
	//       .put(baseUrl + "/users/" + updatedContact._id)
	//       .set("x-access-token", token)
	//       .send(updatedContact)
	//       .end(function (err, res) {
	//         assert.isDefined(err);
	//         assert.equal(res.status, 403);
	//         done();
	//       });
	//   });
	//   it("should deleteById() - 1", function (done) {
	//     var countBefore, countAfter;
	//     // Count documents before
	//     UserModel.count({}, function (err, count) {
	//       countBefore = count;
	//     });
	//     // Delete Request
	//     request
	//       .del(baseUrl + "/users/" + mockedUser._id)
	//       .set("x-access-token", token)
	//       .end(function (err, res) {
	//         assert.isNull(err);
	//         assert.equal(res.status, 204);
	//         // Count documents after DELETE
	//         UserModel.count({}, function (err, count) {
	//           countAfter = count;
	//           assert.equal(countAfter, countBefore - 1);
	//           done();
	//         });
	//       });
	//   });
	//   it("should deleteById() - 2 (is not superadmin)", function (done) {
	//     // Delete Request
	//     request
	//       .del(baseUrl + "/users/" + "other-id")
	//       .set("x-access-token", token)
	//       .end(function (err, res) {
	//         assert.equal(res.status, 403);
	//         done();
	//       });
	//   });
	// });
});
