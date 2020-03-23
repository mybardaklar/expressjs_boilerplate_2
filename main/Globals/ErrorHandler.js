'use strict'

class ErrorHandler extends Error {
  constructor(statusCode, message, data) {
    super(message)
    this.statusCode = statusCode
    this.data = data
  }
}

module.exports = ErrorHandler
