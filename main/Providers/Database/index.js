'use strict'

const consola = require('consola')
const mongodb = require('./Database.mongodb')

let Database = null

switch (pxl.config.database.connection) {
  case 'mongodb':
    Database = mongodb
    break

  default:
    consola.error({
      message: 'Please provide a database management system.',
      badge: true
    })
    break
}

module.exports = Database
