# Birthday Reminder API [![Build Status](https://travis-ci.org/Budmore/Contacts-Manager-NodeJS.svg?branch=master)](https://travis-ci.org/Budmore/Contacts-Manager-NodeJS)

This is backend for [Birthday Reminder] application. Is written in NodeJS + MongoDB.


[Birthday Reminder]:https://github.com/Budmore/Contacts-Manager-Client


## Endpoints

#### Contacts Resources

- **<code>POST</code> /contacts**
- **<code>GET</code> /contacts**
- **<code>GET</code> /contacts/:id**
- **<code>PUT</code> /contacts/:id**
- **<code>DELETE</code> /contacts/:id**

#### Users Resources

- **<code>GET</code> /user**
- **<code>GET</code> /users**
- **<code>GET</code> /users/:id**
- **<code>PUT</code> /users/:id**
- **<code>DELETE</code> /users/:id**

#### Auth Resources

- **<code>POST</code> /auth/login**
- **<code>POST</code> /auth/register**
- **<code>GET</code> /auth/me**



## Build & development

```
npm install
npm start

```

Run `npm install` for building and `npm start` for preview.

Create config.js (follow by the config.example.js) 
Do not commit your config.js file to any repo!



## Testing
```
npm test
npm run-script test-tdd

```

Running `npm test` or `npm run-script test-tdd` will run the unit tests with Mocha and Chai.
