'use strict'

const { MohError, initMohError } = require('../lib')

const message = 'The test message'
const defaultError = new Error(message)
const ERRORS = {
  UNAUTH: {
    status: 401,
    code: 11001,
    message: 'User not authenticated'
  }
}

describe('Init mohError', () => {
  it('should return mohError with message', () => {
    const error = new MohError(message)

    expect(error.isMohError).toBe(true)
    expect(error.message).toBe(message)
  })

  it('should return mohError with info object', () => {
    const error = new MohError({ status: 403 })

    expect(error.isMohError).toBe(true)
  })

  it('should return mohError with message and info object', () => {
    const error = new MohError(message, { status: 403 })

    expect(error.isMohError).toBe(true)
    expect(error.message).toBe(message)
  })

  it('should return mohError with message and status code', () => {
    const error = new MohError(message, 403)

    expect(error.isMohError).toBe(true)
    expect(error.message).toBe(message)
  })

  it('should return mohError with ohter Error', () => {
    const err = new Error('original error')
    const error = new MohError(err, { a: 'a' })

    expect(error.isMohError).toBe(true)
    expect(error.message).toBe('original error')
    expect(error.a).toBe('a')
  })

  it('should return mohError with ohter mohError', () => {
    const err = new MohError('original error', { a: 'a' })
    const error = new MohError(err, { message: 'new message' })

    expect(error.isMohError).toBe(true)
    expect(error.message).toBe('new message')
    expect(error.a).toBe('a')
    expect(error.stack).toEqual(err.stack)
  })
})

describe('Init with invalid arg', () => {
  it('should return error object with no args', () => {
    const error = new MohError()

    expect(error.isMohError).toBe(undefined)
  })

  it('should return error object with array type single arg', () => {
    const error = new MohError(['a'])

    expect(error.isMohError).toBe(undefined)
  })

  it('should return error object with number type single arg', () => {
    const error = new MohError(3211)

    expect(error.isMohError).toBe(undefined)
  })

  it('should return error object with incorrect args', () => {
    const error = new MohError(message, 3211)

    expect(error.isMohError).toBe(undefined)
  })

  it('should return error object with incorrect args', () => {
    const error = new MohError(['a'], { a: 'a' })

    expect(error.isMohError).toBe(undefined)
  })

  it('should return error object with incorrect args', () => {
    const error = new MohError(message, 3021)

    expect(error.isMohError).toBe(undefined)
  })
})

describe('Init mohError with Error obj', () => {
  it('should return mohError with default error', () => {
    const error = new MohError(defaultError)

    expect(error.isMohError).toBe(true)
    expect(error.message).toBe(message)
    expect(error.stack).toBe(defaultError.stack)
  })

  it('should return mohError with default error and new message', () => {
    const error = new MohError(defaultError, { message: 'new message' })

    expect(error.isMohError).toBe(true)
    expect(error.message).toBe('new message')
    expect(error.stack).toBe(defaultError.stack)
  })
})

describe('Init mohError with normal obj', () => {
  it('should return mohError with normal object', () => {
    const error = new MohError(ERRORS.UNAUTH)

    expect(error.isMohError).toBe(true)
    expect(error.message).toBe(ERRORS.UNAUTH.message)
    expect(error.status).toBe(401)
    expect(error.statusCode).toBe(401)
    expect(error.code).toBe(11001)
  })

  it('should return mohError with normal object and new message', () => {
    const error = new MohError('new message', ERRORS.UNAUTH)

    expect(error.isMohError).toBe(true)
    expect(error.message).toBe('new message')
    expect(error.status).toBe(401)
    expect(error.statusCode).toBe(401)
    expect(error.code).toBe(11001)
  })
})

describe('Init mohError with statusCode', () => {
  it('should return mohError with status code', () => {
    const error = new MohError('Unauthorized', 401)

    expect(error.isMohError).toBe(true)
    expect(error.message).toBe('Unauthorized')
    expect(error.statusCode).toBe(401)
  })
})

describe('Return extra info', () => {
  it('MohError shoule able to return back the info object', () => {
    const error = new MohError('Unauthorized', {
      statusCode: 401,
      status: 400,
      user: {
        name: 'Oliver',
        email: 'ole3021@gmail.com'
      }
    })

    const info = error.getExtraInfo()

    expect(info.isMohError).toBe(error.isMohError)
    expect(info.statusCode).toBe(error.statusCode)
    expect(info.status).toBe(error.status)
  })
})

describe('Init mohError with sidecase', () => {
  it('should use statusCode if have both status and statusCode', () => {
    const error = new MohError('Unauthorized', {
      statusCode: 401,
      status: 400
    })

    expect(error.isMohError).toBe(true)
    expect(error.message).toBe('Unauthorized')
    expect(error.statusCode).toBe(401)
    expect(error.status).toBe(401)
  })

  it('should have no status and statusCode if the status is not a valid statusCode', () => {
    const error = new MohError('Unauthorized', {
      status: '400'
    })

    expect(error.isMohError).toBe(true)
    expect(error.message).toBe('Unauthorized')
    expect(error.statusCode).toBe(undefined)
    expect(error.status).toBe(undefined)
  })

  it('should have no status and statusCode if the status is not a valid statusCode', () => {
    const error = new MohError('Unauthorized', {
      status: 'success'
    })

    expect(error.isMohError).toBe(true)
    expect(error.message).toBe('Unauthorized')
    expect(error.statusCode).toBe(undefined)
    expect(error.status).toBe(undefined)
  })

  it('should have no status and statusCode if the status is not a valid statusCode', () => {
    const error = new MohError('Unauthorized', {
      status: 900
    })

    expect(error.isMohError).toBe(true)
    expect(error.message).toBe('Unauthorized')
    expect(error.statusCode).toBe(undefined)
    expect(error.status).toBe(undefined)
  })
})
