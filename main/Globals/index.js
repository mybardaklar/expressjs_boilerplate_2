'use strict'

const Generic = require('./Generic')
const Mail = require('./Mail')
const ErrorHandler = require('./ErrorHandler')

global.pxl = {
  ...global.pxl,
  ErrorHandler: ErrorHandler,
  Model: Generic.Model,
  Mail: Mail,
  functions: {
    convertSize: Generic.convertSize
  }
}
