'use strict'

const httpError = require('http-errors')
const Raven = require('raven')
const debug = require('debug')('moh:error')

class MohError extends Error {
  constructor(...args) {
    debug(`Init MohError with args: ${args}`)
    let message, info, status, isInvalidArgs

    const statusRegx = /^[1-5][0-9][0-9]$/

    const isObject = target =>
      typeof target === 'object' && !Array.isArray(target) && target !== null
    const isString = target => typeof target === 'string'
    const isStatusCode = target =>
      typeof target === 'number' && statusRegx.test(target)

    // filter args
    switch (args.length) {
      case 1:
        if (!isString(args[0]) && !isObject(args[0])) {
          isInvalidArgs = true
          break
        }
        if (isObject(args[0])) info = args[0]
        if (isString(args[0])) message = args[0]
        break
      case 2:
        if (
          !isString(args[0]) ||
          (!isObject(args[1]) && !isStatusCode(args[1]))
        ) {
          isInvalidArgs = true
          break
        }
        message = args[0]
        if (isObject(args[1])) info = args[1]
        if (isStatusCode(args[1])) status = args[1]
        break
      default:
        isInvalidArgs = true
        break
    }
    // return default error if is invalid args
    if (isInvalidArgs) {
      debug(
        'Failed to generate MohError, please check args: ' +
          '\n with 1 arg: String || Object ' +
          '\n with 2 args: [String, Object], [String, StatusCode(/^[1-5][0-9][0-9]$/)]'
      )
      return new Error(...args)
    }

    // init moh error
    super(message || (info && info.message) || 'unexpected error')

    this.name = 'Error'
    this.isMohError = true
    this.isSentry = false

    if (info) {
      if (info.status && isStatusCode(info.status)) status = info.status
      if (info.statusCode && isStatusCode(info.statusCode))
        status = info.statusCode
    }
    if (status) this.statusCode = this.status = status

    debug(
      `Init mohError with  message: ${message} status: ${status} info: ${JSON.stringify(
        info
      )}`
    )

    if (info) this.setExtraInfo(info)
    if (this.isSentry && process.env['SENTRY_DSN']) this.toSentry()
  }

  setExtraInfo(info) {
    const constKeys = ['message', 'status', 'statusCode']

    if (info instanceof Error) {
      ;(this.name = info.name || this.name), (this.stack = info.stack)
    }
    // handle other kind of object
    Object.keys(info).forEach(key => {
      // messages is build in constructor
      if (constKeys.indexOf(key) < 0) this[key] = info[key]
    })
  }

  getExtraInfo() {
    return Object.keys(this).reduce((infoObj, key) => {
      infoObj[key] = this[key]
      return infoObj
    }, {})
  }

  toHttp() {
    return httpError(this.statusCode, this.message, this.getExtraInfo())
  }

  toSentry() {
    try {
      Raven.captureException(this)
    } catch (err) {
      console.error('>>>[moh-error]faile to send to sentry', err)
      throw err
    }
  }
}

exports.MohError = MohError

exports.init = () => {
  try {
    debug('>>> init MohError')
    if (process.env['SENTRY_DSN']) {
      debug('>>> init sentry config')
      Raven.config(process.env['SENTRY_DSN']).install()
    }
    // TODO: handle uncaught exception
    process.on('uncaughtException', err => {
      debug('>>> handle uncaught error')
      const uncaughtError = new MohError(err, {
        isSentry: true
      })
      // TODO: handle the uncaughtError
    })
  } catch (err) {
    console.error('>>>[moh-error]fail to init MohError', err)
  }
}
