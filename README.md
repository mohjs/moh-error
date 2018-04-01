# moh-unify
Unify of common structure like Error.

## Feature

- [x] Easy to convert to a http response
- [x] Easy to send to sentry
- [ ] Easy to create list of errors
- [x] Easy to add custom info

## Usage

```javascript
const { MohError, initMohError, listMohErrors } = require('moh-errors')

initMohError() // Init required hadnlers, like sentry and `uncaughtException` handler

const httpError = new MohError('errmessage', {
  status: 403,
  code: 1008
})

httpError.toHttp() // trans to http-error

const err = new Error('system error')

const httpError = new MohError(err, {
  message: 'invalid password',
  userInfo: {
    username: ole3021,
    target: www.github.com
  }
})

const ERROR = {
  LOGIN_ERROR: {
    status: 401,
    message: 'invalid to login'
  }
}

const templateError = new MohError(ERROR.LOGIN_ERROR, {
  details: [{
    messsage: 'missing username'
  }, {
    message: 'missing pasword'
  }]
})

```

### ToSentry
1. set the sentry DSN with env variable `SENTRY_DSN`
2. set the config `isSentry` to `true` to send the error to sentry
3. call `initMohError()` to init the config


## Best Practice

### Simple error name
Use general error type as name to category error by types

### Human readable message
Use humand readable message as error message

### More details
Add more details in `details` prop for multi reason (validate errors) of the reason

### Easy to trace
Add any filed required for sentry or other system to trace the source and extra info of the error