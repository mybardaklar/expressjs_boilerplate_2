'use strict'

require('config/roles')
require('app/Middleware/Authentication/JwtStrategy')

module.exports = require('app/Middleware/Authentication/index')
