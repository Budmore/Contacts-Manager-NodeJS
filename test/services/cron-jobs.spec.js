'use strict';
var assert       = require('chai').assert;
var mongoose     = require('mongoose');
var sinon        = require('sinon');
var rewire       = require('rewire');

var UserModel    = require('../../app/models/user');
var ContactModel = require('../../app/models/contact');
var cronJobs     = rewire('../../app/services/cron-jobs');



describe('Service: cronJobs', function() {

	var mockedId = mongoose.Types.ObjectId();
	var d = new Date();
	var day = d.getDate();
	var month = d.getMonth();


	var mockedContacts = [{
		_userid: mockedId,
		firstname: 'Jakub',
		dates: [
			{
				type: 'BIRTDATE',
				date: new Date(1987, month, day),
				year: 1987,
				month: month,
				day: day
			},
			{
				type: 'CUSTOM',
				date: new Date(2000, 3, 11),
				year: 2000,
				month: 6,
				day: 11
			}
		]
	},{
		_userid: mockedId,
		firstname: 'Bobek',
		dates: [
			{
				type: 'BIRTDATE',
				date: new Date(1987, month, day + 5),
				year: 1987,
				month: month,
				day: day + 5
			}
		]
	}];

	var userMocked = {
		_id: mockedId,
		email: 'jk.morgan@gmail.com',
		password: 'pritty#3strong)(password',
		notificationsTypes: {
			email: true
		},
		recipients: {
			emails: ['test@budmore.pl', 'test1@budmore.pl']

		}
	};

	beforeEach('Create user (to test on it)',function(done) {

		var createUser = new UserModel(userMocked);

		createUser.save(function(err, user) {
			assert.isNull(err);
			assert.ok(user);
			done();
		});

	});



	beforeEach('Create contacts with _userid (to test on it)',function(done) {

		var createContact = new ContactModel();

		createContact.collection.insert(mockedContacts, function(err, contacts) {
			assert.isNull(err);
			assert.ok(contacts);
			assert.isArray(contacts);
			done();
		});

	});



	it('should getContacts() ', function(done) {
		// var mail = cronJobs.__get__('mail');
		// var spy1 = sinon.spy(mail, 'generateTemplate');


		// console.log('this', contactsServiceMock.findContactsByDateRange);

		// var startDate = new Date();
		// var endDate = new Date();



		// cronJobs.getContacts(startDate, endDate);
		cronJobs.checkAndSend();

		// console.log('assert',  spy1.calledOnce);

		// assert.ok(spy.withArgs(startDate, endDate).calledOnce);

		// var stub = sinon.stub(cronJobs.prototype, 'on').contactsService('return object');


		// assert.ok(stub.calledWith('contactsService'));
		// cronJobs.prototype.on.restore();
		// assert(spy.withArgs(1).calledOnce);


		done();
		// cronJobs.checkAndSend().then(function(data) {
		// 	console.log('checkAndSend', data);
		//  done();
		// });


		// service.birthdateCheck(someDay).then(function(data) {
		// 	var dataDate = data[0].birthdate.date.toString();
		// 	var mockedDate = mockedContact.birthdate.date.toString();

		// 	assert.equal(dataDate, mockedDate);
		// 	done();
		// });

	});


});
