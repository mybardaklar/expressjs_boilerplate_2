'use strict'

const Generic = require('./Generic')
const Mail = require('./Mail')
const ErrorHandler = require('./ErrorHandler')
const Helpers = require('./Helpers')

global.pxl = {
  ...global.pxl,
  ErrorHandler,
  Model: Generic.Model,
  Mail,
  Helpers,
  functions: {
    convertSize: Generic.convertSize
  }
}
