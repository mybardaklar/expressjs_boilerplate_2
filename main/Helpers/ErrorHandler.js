'use strict'

class ErrorHandler extends Error {
  constructor(statusCode, message, errorCode, data) {
    super(message)
    this.statusCode = statusCode
    this.errorCode = errorCode
    this.data = data
  }
}

module.exports = ErrorHandler
