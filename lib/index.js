'use strict'

const httpError = require('http-errors')
const Raven = require('raven')

exports.MohError = class MohError extends Error {
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
    if (this.isSentry) this.toSentry()

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
    //   TOOD: Implementation the logic
  }
    
}

exports.initMohError = () => {
  console.log('>>> init MohError')
  process.on('uncaughtException', (err) => {
    const uncaughtError = new MohError(err, {
      isSentry: true
    })
    // TODO: handle the uncaughtError
  })
}

exports.listMohErrors = (arrayOfErrors) => {
  // TODO: Conver Array of errors into single error
}