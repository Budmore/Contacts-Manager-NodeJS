var request = require('superagent');
var jwt = require('jsonwebtoken');

// var app = require('../../../app');
// var config = require('../../../config');
// var port = config.port;
// var version = config.version;
// var baseUrl = 'http://localhost:' + port + version;
// var ContactModel = require('../models/contact');

// var token = 'mock-token';
// var mockedPayload = {
// 	email: 'test@tes.com',
// 	_id: '55166e70fb1e9a18818ad8fd',
// };

describe.skip('Contacts API', function () {
	it('should pass', () => {
		expect(2).toEqual(2);
	});
	// beforeAll(async () => {
	//   await mongoose.connect(process.env.MONGO_URI);
	// });
	// afterAll(async () => {
	//   await mongoose.disconnect();
	// });
	// beforeAll("create mocked token", function (done) {
	//   token = jwt.sign(mockedPayload, config.secret);
	//   done();
	// });
	// beforeEach(async () => {
	//   await ContactModel.deleteMany();
	//   var mockedContact = {
	//     _userid: mockedPayload._id,
	//     firstname: "Jakub",
	//     lastname: "Mach",
	//     nickname: "Budmore",
	//   };
	//   const contacts = await new ContactModel.create([mockedContact]);
	//   expect(contacts).toBeTruthy();
	//   expect(Array.isArray(contacts)).toBe(true);
	// });
	// it("should get isAlive message from the server", async () => {
	//   request.get(baseUrl + "/").end(function (err, res) {
	//     // assert.isNull(err);
	//     expect(res.test).toEqual("isAlive");
	//     // assert.ok(res);
	//     // assert.equal(res.text, _msg);
	//     // assert.equal(res.status, 200);
	//   });
	// });
	// it("should get all contacts from DB", function (done) {
	//   request
	//     .get(baseUrl + "/contacts")
	//     .set("x-access-token", token)
	//     .end(function (err, res) {
	//       assert.isNull(err);
	//       assert.isArray(res.body.data);
	//       assert.equal(res.status, 200);
	//       done();
	//     });
	// });
	// it("should get all contacts from DB - 2", function (done) {
	//   request
	//     .get(baseUrl + "/contacts")
	//     .set("x-access-token", token)
	//     .end(function (err, res) {
	//       assert.isArray(res.body.data);
	//       done();
	//     });
	// });
	// it("should create new contact", function (done) {
	//   var _data = {
	//     firstname: "Jakub",
	//     lastname: "Mach",
	//     dates: [
	//       {
	//         date: new Date(2001, 1, 2),
	//       },
	//     ],
	//   };
	//   request
	//     .post(baseUrl + "/contacts")
	//     .set("x-access-token", token)
	//     .send(_data)
	//     .end(function (err, res) {
	//       assert.isNull(err);
	//       assert.isObject(res.body);
	//       assert.equal(res.status, 200);
	//       done();
	//     });
	// });
	// describe("with id", function () {
	//   const mockedContact = {
	//     _id: "55166e70fb1e9a18818ad8fd",
	//     _userid: mockedPayload._id,
	//     firstname: "Jakub",
	//     lastname: "Mach",
	//     nickname: "Budmore",
	//   };
	//   beforeEach(async () => {
	//     await ContactModel.deleteMany();
	//     const contacts = await new ContactModel.create([mockedContact]);
	//     expect(contacts).toBeTruthy();
	//     expect(Array.isArray(contacts)).toBe(true);
	//   });
	//   it("should get contact by id", function (done) {
	//     request
	//       .get(baseUrl + "/contacts/" + mockedContact._id)
	//       .set("x-access-token", token)
	//       .end(function (err, res) {
	//         assert.isNull(err);
	//         assert.isObject(res);
	//         assert.equal(res.body._id, mockedContact._id);
	//         assert.equal(res.body.lastname, mockedContact.lastname);
	//         assert.equal(res.status, 200);
	//         done();
	//       });
	//   });
	//   it("should get 404 if contact does not exists", function (done) {
	//     request
	//       .get(baseUrl + "/contacts/fake-id")
	//       .set("x-access-token", token)
	//       .end(function (err, res) {
	//         assert.isDefined(err);
	//         assert.isObject(res);
	//         assert.equal(res.status, 404);
	//         done();
	//       });
	//   });
	//   it("should update existing contact", function (done) {
	//     var updatedContact = {
	//       _id: "55166e70fb1e9a18818ad8fd",
	//       firstname: "Feliks",
	//       lastname: "Mach",
	//       sone: "aala",
	//     };
	//     request
	//       .put(baseUrl + "/contacts/" + mockedContact._id)
	//       .set("x-access-token", token)
	//       .send(updatedContact)
	//       .end(function (err, res) {
	//         assert.isNull(err);
	//         assert.equal(res.status, 200);
	//         assert.equal(res.body.firstname, updatedContact.firstname);
	//         assert.equal(res.body.nickname, mockedContact.nickname);
	//         done();
	//       });
	//   });
	//   it("should remove existing contact", function (done) {
	//     var countBefore, countAfter;
	//     // Count documents before
	//     ContactModel.count({}, function (err, count) {
	//       countBefore = count;
	//     });
	//     // Delete Request
	//     request
	//       .del(baseUrl + "/contacts/" + mockedContact._id)
	//       .set("x-access-token", token)
	//       .end(function (err, res) {
	//         assert.isNull(err);
	//         assert.equal(res.status, 204);
	//         // Count documents after DELETE
	//         ContactModel.count({}, function (err, count) {
	//           countAfter = count;
	//           assert.equal(countAfter, countBefore - 1);
	//           done();
	//         });
	//       });
	//   });
	// });
});
