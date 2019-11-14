'use strict'

require('app/Middleware/Authentication/JwtStrategy')
const Authentication = require('app/Middleware/Authentication/index')

module.exports = [
  Authentication.isAuthenticated,
  Authentication.checkPermission
]
