'use strict'

const test = require('ava')
const { MohError, initMohError } = require('../lib')

test('Can create mohError object with message', t => {
  const error = new MohError('test error message', { status: 400, code: 1008 });

  t.plan(2)
  t.is(error.statusCode, 400, 'statusCode set failed')
  t.is(error.code, 1008, 'error code set failed')
});

test('Can create mohError object with template', t => {
  const errorTemplate = {
    status: 404,
    message: 'Unable to find something',
    someProps: 'need to apper'
  }
  const error = new MohError(errorTemplate, { code: 1008 });

  t.plan(4)
  t.is(error.statusCode, 404, 'statusCode set failed')
  t.is(error.message, 'Unable to find something', 'message set failed')
  t.is(error.code, 1008, 'error code set failed')
  t.is(error.someProps, 'need to apper', 'custom prop set failed')
});

test.skip('Can init the lib and caught uncaught errors', t => {
  initMohError()
})