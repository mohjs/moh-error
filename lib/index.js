'use strict'

const httpError = require('http-errors')
const Raven = require('raven')

class MohError extends Error {
  constructor(messageORtemplate, info) {
    if (isTemplate(messageORtemplate)) {
      super(messageORtemplate.message || info.message || 'Undefined Error Message')
      this.setExtraInfo(messageORtemplate) // Copy object props into the error
    } else {
      super(messageORtemplate)
    }

    this.isMohError = true
    this.isSentry = false;

    this.setExtraInfo(info)
    if (this.isSentry && process.env['SENTRY_DSN']) this.toSentry()

    function isTemplate(messageORtemplate) {
      return (typeof messageORtemplate === 'object')
    }
  }

  setExtraInfo(obj) {
    Object.keys(obj).map(key => {
      // Convert status to statusCode
      this[key === 'status' ? 'statusCode' : key] = obj[key]
    });
  }

  getExtraInfo() {
    return Object.keys(this).reduce((infoObj, key) => {
      infoObj[key] = this[key]
      return infoObj
    }, {})
  }

  toHttp() {
    return httpError(parseInt(this.statusCode), this.message, this.getExtraInfo())
  }
  
  toSentry() {
    try {
      Raven.captureException(this);  
    } catch (err) {
      console.error('>>> faile to send to sentry', err)
      throw err
    }
  }
    
}

exports.MohError = MohError

exports.initMohError = () => {
  try {
    console.log('>>> init MohError')
  if (process.env['SENTRY_DSN']) {
    console.log('>>> init sentry config')
    Raven.config(process.env['SENTRY_DSN']).install();
  }
  // TODO: handle uncaught exception
  process.on('uncaughtException', (err) => {
    console.log('>>> in uncaught error')
    const uncaughtError = new MohError(err, {
      isSentry: true
    })
    // TODO: handle the uncaughtError
  })
  } catch (err) {
    console.error('>>> fail to init MohError', err)
  }
}

exports.listMohErrors = (arrayOfErrors) => {
  // TODO: Conver Array of errors into single error
}