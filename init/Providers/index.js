'use strict'

const Router = require('./RouteProvider')
const Database = require('./DatabaseProvider')
const Authentication = require('./AuthenticationProvider')

module.exports = {
  Database,
  Authentication,
  Router
}
