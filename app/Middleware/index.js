'use strict'

const compose = require('compose-middleware').compose

const Authentication = require('./Authentication')

module.exports = compose([Authentication])
