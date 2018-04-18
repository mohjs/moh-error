# moh-error

[![Build Status](https://travis-ci.org/mohjs/moh-errors.svg?branch=master)](https://travis-ci.org/mohjs/moh-errors)

The advanced http response friendly Error class (extend from Error) to handle error with more info and features.

## Features

* Easy way to create advanced Error with extra info
* Easy to transform to Http response
* Easy to send error to sentry

## Installation

```bash
# with yarn
yarn add moh-error --save

# with npm
npm install moh-error --save
```

## Usage

```javascript
const { MohError: MyError } = require('moh-error')

// use like normal Error
const error = new MyError('The error message')

// use with normal Error
const someErr = new Error('Default Error')
const error = new MyError(someErr)

// use with custom object
const ERRORS = {
  UNAUTH: {
    status: 401,
    code: 11001,
    message: 'User not authenticated'
  }
}
const error = new MyError(ERRORS.UNAUTH)

// add extra info
const loginError = new MyError('Faild to login', {
  user: {
    username: 'ole3021',
    password: 'youshouldnotpass'
  },
  isSentry: true // will send this error to sentry
})

// add status code
const error = new MyError('Unauthorized', 401)
res.send(error.toHttp())
```

### init()

The method to init the lib, include [sentry](https://sentry.io/welcome/) and `unExpectedError` handling.(not necessary if not use those features.)

### toHttp()

The method to transform the error object to an response
`mohErrorInstance.toHttp()`

### isSentry

Add `isSentry` prop in the create error info, will send this error to sentry.

## TODO

* [ ] Handle list of errors
* [ ] Handle uncaught error
